---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Constants](../index.md) / SOL\_SRS\_CLASS

# Variable: SOL\_SRS\_CLASS

> `const` **SOL\_SRS\_CLASS**: `Address`

Defined in: [constants/addresses.ts:70](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/constants/addresses.ts#L70)

The Solana Registration Service class PDA for `.sol` records.

This address is derived from `SRS_CENTRAL_STATE`, `.sol`, and
`SRS_PROGRAM_ADDRESS`. It must be recomputed if either
`SOL_REGISTRAR_PROGRAM_ADDRESS` or `SRS_PROGRAM_ADDRESS` is updated.
