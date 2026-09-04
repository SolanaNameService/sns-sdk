---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / ResolveConfig

# Type Alias: ResolveConfig

> **ResolveConfig** = \{ `allowPda`: `false`; `programIds?`: `never`; \} \| \{ `allowPda`: `"any"`; `programIds?`: `never`; \} \| \{ `allowPda`: `true`; `programIds`: `PublicKey`[]; \}

Defined in: [resolve/types.ts:4](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/resolve/types.ts#L4)

Controls whether resolution may return program-derived-address owners.
