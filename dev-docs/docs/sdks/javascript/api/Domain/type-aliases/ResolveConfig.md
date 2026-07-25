---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / ResolveConfig

# Type Alias: ResolveConfig

> **ResolveConfig** = \{ `allowPda`: `false`; `programIds?`: `never`; \} \| \{ `allowPda`: `"any"`; `programIds?`: `never`; \} \| \{ `allowPda`: `true`; `programIds`: `PublicKey`[]; \}

Defined in: [resolve/types.ts:4](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/resolve/types.ts#L4)

Controls whether resolution may return program-derived-address owners.
