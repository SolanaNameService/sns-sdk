/// Constants and addresses for the Solana Name Service (SNS) SDK.
///
/// Contains program addresses, token mints, and other constants
/// required for interacting with SNS on the Solana blockchain.
library;

/// System program address
const String systemProgramAddress = '11111111111111111111111111111111';

/// Sysvar rent address
const String sysvarRentAddress = 'SysvarRent111111111111111111111111111111111';

/// Default address (system program)
const String defaultAddress = '11111111111111111111111111111111';

/// Address of the SPL Token program
const String tokenProgramAddress =
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

/// The Solana Name Service program address
const String nameProgramAddress = 'namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX';

/// The `.sol` TLD
const String rootDomainAddress = '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx';

/// The SNS Registry program address
const String registryProgramAddress =
    'jCebN34bUfdeUYJT13J1yG16XWQpt5PDx6Mse9GUqhR';

/// The SNS Name Tokenizer program address
const String nameTokenizerAddress =
    'nftD3vbNkNqfj2Sd3HZwbpw4BxxKWr4AjGb9X38JeZk';

/// The SNS Offers program address
const String nameOffersAddress = '85iDfUvr3HJyLM2zcq5BXSiDvUWfw6cSE1FfNBo8Ap29';

/// The SNS Records program address (SNS_RECORDS_ID)
const String recordsProgramAddress =
    'HP3D4D1ZCmohQGFVms2SS4LCANgJyksBf5s1F77FuFjZ';

/// The vault owner address
const String vaultOwner = '5D2zKog251d6KPCyFyLMt3KroWwXXPWSgTPyhV22K2gR';

/// Custom background TLD address for domain backgrounds
const String customBgTld = 'BPeXUQDqGbzxeK1LJby6ugvCBuo7kRSEUkjD726mUVsz';

/// USDC mint address
const String usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

/// FIDA mint address
const String fidaMint = 'EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp';

/// The reverse look up class
const String reverseLookupClass =
    '33m47vH6Eav6jr5Ry86XjhRft2jRBLDnDgPSHoquXi2Z';

/// The central state
const String centralState = '33m47vH6Eav6jr5Ry86XjhRft2jRBLDnDgPSHoquXi2Z';

/// The central state for domain records (CENTRAL_STATE_SNS_RECORDS)
const String centralStateDomainRecords =
    '2pMnqHvei2N5oDcVGCRdZx48gqti199wr5CsyTTafsbo';

/// The `.twitter` TLD authority
const String twitterVerificationAuthority =
    'FvPH7PrVrLGKPfqaf3xJodFTjZriqrAXXLTVWEorTFBi';

/// The `.twitter` TLD
const String twitterRootParentRegistryAddress =
    '4YcexoW3r78zz16J2aqmukBLRwGq6rAvWzJpkYAXqebv';

/// Metaplex program address
const String metaplexProgramAddress =
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

/// Wolves collection metadata address
const String wolvesCollectionMetadata =
    '72aLKvXeV4aansAQtxKymeXDevT5ed6sCuz9iN62ugPT';

/// Associated token program address
const String associatedTokenProgramAddress =
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';

/// List of referrer addresses
const List<String> referrers = [
  '3ogYncmMM5CmytsGCqKHydmXmKUZ6sGWvizkzqwT7zb1', // Test wallet
  'DM1jJCkZZEwY5tmWbgvKRxsDFzXCdbfrYCCH1CtkguEs', // 4Everland
  'ADCp4QXFajHrhy4f43pD6GJFtQLkdBY2mjS9DfCK7tNW', // Bandit network
  '2XTgjw8yi1E3Etgj4CUyRD7Zk49gynH2U9gA5N2MY4NP', // Altoscan
  '5PwNeqQPiygQks9R17jUAodZQNuhvCqqkrxSaeNE8qTR', // Solscan
  '8kJqxAbqbPLGLMgB6FhLcnw2SiUEavx2aEGM3WQGhtJF', // Domain Labs
  'HemvJzwxvVpWBjPETpaseAH395WAxb2G73MeUfjVkK1u', // Solflare
  '7hMiiUtkH4StMPJxyAtvzXTUjecTniQ8czkCPusf5eSW', // Solnames
  'DGpjHo4yYA3NgHvhHTp3XfBFrESsx1DnhfTr8D881ZBM', // Brave
  '7vWSqSw1eCXZXXUubuHWssXELNQ8MLaDgAs2ErEfCKxn', // 585.eth
  '5F6gcdzpw7wUjNEugdsD4aLJdEQ4Wt8d6E85vaQXZQSJ', // wdotsol
  'XEy9o73JBN2pEuN7aspe8mVLaWbL4ozjJs1tNRxx8bL', // GoDID
  'D5cLoAGjNTHKU1UGv2bYwbnyRoGTMe3sbpLtJW3fRq91', // SuiNS
  'FePcCmrr7vgjeFXcXtJHqShSXydaTrga2wfHRt9RrYvP', // Nansen
  '5D2zKog251d6KPCyFyLMt3KroWwXXPWSgTPyhV22K2gR', // SNS
  '452cMqDHe5cf1Z96HxUNaQjiLckhMiZdZ5abe7oQ2iRB', // Endless Domains
  '8hmebGRQpZG8RpR3SFTfnuY2K4QgNxyAtqdhR9UuFksB', // Coupon Vault
  '7siDgAEyXRCEhNjZcQ8VLVbMxXQaQY4hNcRbGbKj2i7u', // CFL
];

/// Pyth solana price feed address
const String pythSolanaPriceFeed =
    'H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG';

/// Pyth USD price feed address
const String pythUsdPriceFeed = 'Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD';

/// Pyth program address
const String pythProgramAddress =
    'FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH';

/// Default Pyth push program address
const String defaultPythPushProgram =
    'pythWSnswVUd12oZpeFP8e9CVaEqJg25g1Vtc2biRsT';

/// Pyth price feeds mapping for different mints
const Map<String, String> pythFeeds = {
  usdcMint: pythUsdPriceFeed,
  'So11111111111111111111111111111111111111112':
      pythSolanaPriceFeed, // SOL mint
};

/// Pyth pull feeds mapping for registerDomainNameV2
/// These are the exact feed IDs used in the JavaScript SDK
const Map<String, List<int>> pythPullFeeds = {
  // USDC mint
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': [
    234,
    160,
    32,
    198,
    28,
    196,
    121,
    113,
    40,
    19,
    70,
    28,
    225,
    83,
    137,
    74,
    150,
    166,
    192,
    11,
    33,
    237,
    12,
    252,
    39,
    152,
    209,
    249,
    169,
    233,
    201,
    74,
  ],
  // USDT mint
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': [
    43,
    137,
    185,
    220,
    143,
    223,
    159,
    52,
    112,
    154,
    91,
    16,
    107,
    71,
    47,
    15,
    57,
    187,
    108,
    169,
    206,
    4,
    176,
    253,
    127,
    46,
    151,
    22,
    136,
    226,
    229,
    59,
  ],
  // SOL mint
  'So11111111111111111111111111111111111111112': [
    239,
    13,
    139,
    111,
    218,
    44,
    235,
    164,
    29,
    161,
    93,
    64,
    149,
    209,
    218,
    57,
    42,
    13,
    47,
    142,
    208,
    198,
    199,
    188,
    15,
    76,
    250,
    200,
    194,
    128,
    181,
    109,
  ],
  // FIDA mint
  'EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp': [
    200,
    6,
    87,
    183,
    246,
    243,
    234,
    194,
    114,
    24,
    208,
    157,
    90,
    78,
    84,
    228,
    123,
    37,
    118,
    141,
    159,
    94,
    16,
    172,
    21,
    254,
    44,
    249,
    0,
    136,
    20,
    0,
  ],
  // mSOL mint
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': [
    194,
    40,
    154,
    106,
    67,
    210,
    206,
    145,
    198,
    245,
    92,
    174,
    195,
    112,
    244,
    172,
    195,
    138,
    46,
    212,
    119,
    245,
    136,
    19,
    51,
    76,
    109,
    3,
    116,
    159,
    242,
    164,
  ],
  // BONK mint
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': [
    114,
    176,
    33,
    33,
    124,
    163,
    254,
    104,
    146,
    42,
    25,
    170,
    249,
    144,
    16,
    156,
    185,
    216,
    78,
    154,
    208,
    4,
    180,
    210,
    2,
    90,
    214,
    245,
    41,
    49,
    68,
    25,
  ],
  // Pyth mint
  'EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz': [
    142,
    134,
    15,
    183,
    78,
    96,
    229,
    115,
    107,
    69,
    93,
    130,
    246,
    11,
    55,
    40,
    4,
    156,
    52,
    142,
    148,
    150,
    26,
    221,
    95,
    150,
    27,
    2,
    253,
    238,
    37,
    53,
  ],
  // PYTH mint (alternative)
  'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3': [
    11,
    191,
    40,
    233,
    168,
    65,
    161,
    204,
    120,
    143,
    106,
    54,
    27,
    23,
    202,
    7,
    45,
    14,
    163,
    9,
    138,
    30,
    93,
    241,
    195,
    146,
    45,
    6,
    113,
    149,
    121,
    255,
  ],
  // bSOL mint
  'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1': [
    137,
    135,
    83,
    121,
    231,
    15,
    143,
    186,
    220,
    23,
    174,
    243,
    21,
    173,
    243,
    168,
    213,
    209,
    96,
    184,
    17,
    67,
    85,
    55,
    224,
    60,
    151,
    232,
    170,
    201,
    125,
    156,
  ],
  // Additional mint 1
  '6McPRfPV6bY1e9hLxWyG54W9i9Epq75QBvXg2oetBVTB': [
    122,
    91,
    193,
    210,
    181,
    106,
    208,
    41,
    4,
    140,
    214,
    57,
    100,
    179,
    173,
    39,
    118,
    234,
    223,
    129,
    46,
    220,
    26,
    67,
    163,
    20,
    6,
    203,
    84,
    191,
    245,
    146,
  ],
  // Additional mint 2
  '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN': [
    135,
    149,
    81,
    2,
    24,
    83,
    238,
    199,
    167,
    220,
    130,
    117,
    120,
    232,
    230,
    157,
    167,
    228,
    250,
    129,
    72,
    51,
    154,
    160,
    211,
    213,
    41,
    100,
    5,
    190,
    75,
    26,
  ],
};
