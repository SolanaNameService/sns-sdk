import { repositoryUrl, sourceRevision } from "../config/source";

type SourceLinkProps = {
  path: string;
  line: number;
  label?: string;
};

export default function SourceLink({ path, line, label }: SourceLinkProps) {
  const normalizedPath = path.replaceAll("\\", "/");
  const segments = normalizedPath.split("/");

  if (
    normalizedPath.startsWith("/") ||
    segments.some(
      (segment) => segment === "" || segment === "." || segment === "..",
    )
  ) {
    throw new Error(`SourceLink path must be repository-relative: ${path}`);
  }
  if (!Number.isSafeInteger(line) || line < 1) {
    throw new Error(`SourceLink line must be a positive integer: ${line}`);
  }

  const encodedPath = segments.map(encodeURIComponent).join("/");
  const href = `${repositoryUrl}/blob/${encodeURIComponent(sourceRevision)}/${encodedPath}#L${line}`;

  return (
    <a href={href}>
      <code>{label ?? `${normalizedPath}:${line}`}</code>
    </a>
  );
}
