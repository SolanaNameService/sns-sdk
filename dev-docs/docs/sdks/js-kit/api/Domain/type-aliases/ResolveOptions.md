---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / ResolveOptions

# Type Alias: ResolveOptions

> **ResolveOptions** = \{ `allowPda`: `false`; `programIds?`: `never`; \} \| \{ `allowPda`: `"any"`; `programIds?`: `never`; \} \| \{ `allowPda`: `true`; `programIds`: `Address`[]; \}

Defined in: [domain/resolveTypes.ts:10](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/resolveTypes.ts#L10)

Controls whether resolution may return program-derived addresses.
