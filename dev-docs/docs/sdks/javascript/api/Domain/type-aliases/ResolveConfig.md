---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / ResolveConfig

# Type Alias: ResolveConfig

> **ResolveConfig** = \{ `allowPda`: `false`; `programIds?`: `never`; \} \| \{ `allowPda`: `"any"`; `programIds?`: `never`; \} \| \{ `allowPda`: `true`; `programIds`: `PublicKey`[]; \}

Defined in: [resolve/types.ts:4](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/resolve/types.ts#L4)

Controls whether resolution may return program-derived-address owners.
