function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function maskRange(characters, source, start, end) {
  for (let index = start; index < end; index += 1) {
    if (source[index] !== "\n" && source[index] !== "\r") {
      characters[index] = " ";
    }
  }
}

function maskRustNonCode(source) {
  const characters = source.split("");
  let index = 0;

  while (index < source.length) {
    if (source.startsWith("//", index)) {
      const end = source.indexOf("\n", index + 2);
      const rangeEnd = end === -1 ? source.length : end;
      maskRange(characters, source, index, rangeEnd);
      index = rangeEnd;
      continue;
    }

    if (source.startsWith("/*", index)) {
      let depth = 1;
      let end = index + 2;
      while (end < source.length && depth > 0) {
        if (source.startsWith("/*", end)) {
          depth += 1;
          end += 2;
        } else if (source.startsWith("*/", end)) {
          depth -= 1;
          end += 2;
        } else {
          end += 1;
        }
      }
      maskRange(characters, source, index, end);
      index = end;
      continue;
    }

    const rawString = /^(?:br|rb|r)(#*)"/.exec(source.slice(index));
    if (rawString) {
      const terminator = `"${rawString[1]}`;
      const contentStart = index + rawString[0].length;
      const closingQuote = source.indexOf(terminator, contentStart);
      const end =
        closingQuote === -1 ? source.length : closingQuote + terminator.length;
      maskRange(characters, source, index, end);
      index = end;
      continue;
    }

    const stringPrefixLength =
      source[index] === '"'
        ? 0
        : (source[index] === "b" || source[index] === "c") &&
            source[index + 1] === '"'
          ? 1
          : -1;
    if (stringPrefixLength !== -1) {
      let end = index + stringPrefixLength + 1;
      let escaped = false;
      while (end < source.length) {
        if (!escaped && source[end] === '"') {
          end += 1;
          break;
        }
        if (!escaped && source[end] === "\\") {
          escaped = true;
        } else {
          escaped = false;
        }
        end += 1;
      }
      maskRange(characters, source, index, end);
      index = end;
      continue;
    }

    if (source[index] === "'") {
      const characterLiteral =
        /^'(?:\\(?:.|u\{[0-9A-Fa-f_]+\}|x[0-9A-Fa-f]{2})|[^'\\\r\n])'/u.exec(
          source.slice(index),
        );
      if (characterLiteral) {
        const end = index + characterLiteral[0].length;
        maskRange(characters, source, index, end);
        index = end;
        continue;
      }
    }

    index += 1;
  }

  return characters.join("");
}

function findMatchingBrace(source, openingBrace) {
  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}" && --depth === 0) return index;
  }
  return -1;
}

function braceDepthAt(source, start, end) {
  let depth = 0;
  for (let index = start; index < end; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
  }
  return depth;
}

function publicFunctionMatches(source, symbol, start = 0, end = source.length) {
  const pattern = new RegExp(
    String.raw`^[\t ]*pub(?:[\t ]*\([^\r\n)]*\))?[\t ]+(?:async[\t ]+)?fn\s+${escapeRegExp(symbol)}\b`,
    "gm",
  );
  const matches = [];
  pattern.lastIndex = start;
  for (
    let match = pattern.exec(source);
    match && match.index < end;
    match = pattern.exec(source)
  ) {
    matches.push(match.index + match[0].indexOf("pub"));
  }
  return matches;
}

function resolveFreeFunction(source, symbol) {
  return publicFunctionMatches(source, symbol).filter(
    (offset) => braceDepthAt(source, 0, offset) === 0,
  );
}

function resolveAssociatedMethod(source, typeName, method) {
  const implPattern = new RegExp(
    String.raw`\bimpl(?:\s*<[^>{}]*>)?\s+${escapeRegExp(typeName)}(?:\s*<[^>{}]*>)?(?:\s+where[^{}]*)?\s*\{`,
    "g",
  );
  const matches = [];

  for (const implementation of source.matchAll(implPattern)) {
    const openingBrace = implementation.index + implementation[0].length - 1;
    const closingBrace = findMatchingBrace(source, openingBrace);
    if (closingBrace === -1) continue;
    for (const offset of publicFunctionMatches(
      source,
      method,
      openingBrace,
      closingBrace,
    )) {
      if (braceDepthAt(source, openingBrace, offset) === 1) {
        matches.push(offset);
      }
    }
  }

  return matches;
}

export function resolveRustDeclaration(source, symbol) {
  const parts = symbol.split("::");
  if (
    parts.length > 2 ||
    !parts.every((part) => /^[A-Za-z_]\w*$/.test(part)) ||
    (parts.length === 2 && !/^[A-Z]/.test(parts[0]))
  ) {
    throw new Error(
      `symbol must be a Rust function name or Type::method identifier: ${symbol}`,
    );
  }

  const maskedSource = maskRustNonCode(source);
  const matches =
    parts.length === 1
      ? resolveFreeFunction(maskedSource, parts[0])
      : resolveAssociatedMethod(maskedSource, parts[0], parts[1]);

  if (matches.length === 0) {
    throw new Error(`public declaration is missing for ${symbol}`);
  }
  if (matches.length > 1) {
    const lines = matches.map(
      (offset) => source.slice(0, offset).split(/\r?\n/).length,
    );
    throw new Error(
      `multiple public declarations found for ${symbol} at lines ${lines.join(", ")}`,
    );
  }

  const offset = matches[0];
  return {
    offset,
    line: source.slice(0, offset).split(/\r?\n/).length,
  };
}

function parseAttributes(source) {
  const attributes = {};
  const pattern = /\s+(?:(path|label)="([^"]*)"|(line)=\{(\d+)\})/gy;
  let cursor = 0;

  while (cursor < source.length) {
    pattern.lastIndex = cursor;
    const match = pattern.exec(source);
    if (!match) {
      if (source.slice(cursor).trim() === "") break;
      throw new Error(`unsupported SourceLink attributes: ${source.trim()}`);
    }
    const name = match[1] ?? match[3];
    if (Object.hasOwn(attributes, name)) {
      throw new Error(`duplicate SourceLink attribute: ${name}`);
    }
    attributes[name] = name === "line" ? Number(match[4]) : match[2];
    cursor = pattern.lastIndex;
  }

  if (typeof attributes.path !== "string" || attributes.path === "") {
    throw new Error("SourceLink requires a non-empty path attribute");
  }
  if (!Number.isSafeInteger(attributes.line) || attributes.line < 1) {
    throw new Error("SourceLink requires a positive integer line attribute");
  }

  return attributes;
}

export function parseSourceLinks(document) {
  const pattern = /Defined in:\s*<SourceLink\b([\s\S]*?)\/>/g;
  const links = [];

  for (const match of document.matchAll(pattern)) {
    links.push({
      ...parseAttributes(match[1]),
      start: match.index,
      end: match.index + match[0].length,
      raw: match[0],
    });
  }

  return links;
}

export function parseLegacySourceLinks(document) {
  const pattern =
    /Defined in:\s*\[`([^`]+)`\]\(https:\/\/github\.com\/[^/]+\/[^/]+\/blob\/[^/]+\/([^#)]+)#L(\d+)\)/g;
  const links = [];

  for (const match of document.matchAll(pattern)) {
    links.push({
      label: match[1],
      path: match[2]
        .split("/")
        .map((segment) => decodeURIComponent(segment))
        .join("/"),
      line: Number(match[3]),
      start: match.index,
      end: match.index + match[0].length,
      raw: match[0],
    });
  }

  return links;
}

export function formatSourceLink({ path, line, label }) {
  const labelAttribute = label ? ` label="${label}"` : "";
  return `Defined in: <SourceLink path="${path}" line={${line}}${labelAttribute} />`;
}
