---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / ResolveConfig

# Type Alias: ResolveConfig

> **ResolveConfig** = \{ `allowPda`: `false`; `programIds?`: `never`; \} \| \{ `allowPda`: `"any"`; `programIds?`: `never`; \} \| \{ `allowPda`: `true`; `programIds`: `PublicKey`[]; \}

Defined in: [resolve/types.ts:4](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/resolve/types.ts#L4)

Controls whether resolution may return program-derived-address owners.
