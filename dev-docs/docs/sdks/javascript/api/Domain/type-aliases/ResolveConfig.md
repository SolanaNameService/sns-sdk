---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / ResolveConfig

# Type Alias: ResolveConfig

> **ResolveConfig** = \{ `allowPda`: `false`; `programIds?`: `never`; \} \| \{ `allowPda`: `"any"`; `programIds?`: `never`; \} \| \{ `allowPda`: `true`; `programIds`: `PublicKey`[]; \}

Defined in: [resolve/types.ts:4](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/resolve/types.ts#L4)

Controls whether resolution may return program-derived-address owners.
