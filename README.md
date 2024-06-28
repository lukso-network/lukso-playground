# 🤹 LUKSO Playground

Convenient code snippets to interact with [LSP](https://docs.lukso.tech/standards/standards-roadmap) standards on LUKSO. Code examples are taken from the [LUKSO Tech Docs](https://docs.lukso.tech/) and are working as standalone scripts.

## Getting started

### Installation

> A lot of these scripts should run with `ts-node` in development environnements, but you might be encountering issues because of ESM dependencies.

**This repository uses the [bun](https://bun.sh) toolkit to manage packages and run scripts.Make sure to [install it](https://bun.sh/docs/installation) first.**

Then clone this repository and install its dependencies.

```bash
git clone https://github.com/lukso-network/lukso-playground.git

cd lukso-playground && bun install
```

### Run examples

Run the TypeScript code of one file within the terminal using `bun`.

```bash
bun run file-path/script.ts
```

🆙 🔍 For example, to run the code example to fetch various metadata on a Universal Profile:

```bash
bun run universal-profile/fetch-json-data.ts
```

🗃️ This might return you among the values a list of `LSP5ReceivedAssets[]`:

```bash
# ...
{
  key: "0x6460ee3c0aac563ccbf76d6e1d07bada78e3a9514e6382b736ed3f478ab7b90b",
  name: "LSP5ReceivedAssets[]",
  value: [
    "0x8b08eeb9183081De7e2D4ae49fAD4afb56E31Ab4", "0xD9079930Be38bf4CF44cbd54Dbd7417DFc363d0A",
    "0xAB0A093104b6d2d4999Ad40C96d410Bc9601A71F", "0xa289935a2f0e66b0dCB97e95c6c91B0D33280Fa0",
    "0xC94f4b542914e86B8e46c4610CC5A7d06b97aFd4", "0xb52Dc4537AC17f4ab673EEf6645c12425fC5792F",
    "0x0514A829C832639Afcc02D257154A9DaAD8fa21B", "0x2dF821A905A2d007433669AA176EE543b8b73D66",
    "0x631308F794E73Ae9786EE24247aEB1a2ea37D024", "0xa579F6C4F94E03131d7f48Ea4EcFAa7c5b1629be",
    "0xAB84fe1dDF79BEcF2D675d7Ec001Ad1be32Fc9B5", "0xF8E6E921E602301360482CF6CD182232D7EDf39A",
    "0xB64a1A593830De953Cf0f7D1EE18f02C47b54481", "0xD9079930Be38bf4CF44cbd54Dbd7417DFc363d0A"
  ],
}
```

🪙 🔍 Let's now inspect the metadata of the first Digital Asset. In the file ``, adjust the address here as follow:

```ts
async function fetchJSONData() {
  // Instantiate erc725.js
  const erc725js = new ERC725(
    lsp4Schema,
    '0x<asset-address>', // <== Change this line with the asset address
    'https://4201.rpc.thirdweb.com',
    {
      ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
    },
  );

  // rest of the code from this file...
}
```

Then run the script to fetch the asset data

```bash
bun run digital-assets/extract-asset-data.ts
```

## Contents

- [`universal-profile`](./universal-profile): Universal Profile related scripts
- [`digital-assets`](./digital-assets/): Digital assets (LSP7/8) scripts
- [`interface-detection`](./interface-detection): Verify EIP165 Standard Compatibility
- [`key-manager`](./key-manager): Permission Management of Controller Keys
- [`metadata-detection`](./metadata-detection): Verify ERC725Y Storage Compatability
- [`transfer-lyx`](./transfer-lyx): Coin Transfers for Backend and Extension

### 📑 Smart contracts

- [`smart-contracts-hardhat`](./smart-contracts-hardhat): Hardhat Smart Contract Deployment Setup and Scripts

### LUKSO Libraries

- [`@erc725/erc725.js`](https://docs.lukso.tech/tools/erc725js/getting-started)
- [`@lukso/lsp-smart-contracts`](https://docs.lukso.tech/tools/lsp-smart-contracts/getting-started)

Please check the versions used in the [`package.json`](./package.json)

## IPFS Server

We highly recommend that developers fetch and store profile or asset data using **their own IPFS gateway** solutions like [Pinata](https://docs.pinata.cloud/docs/welcome-to-pinata) or [Infura](https://docs.infura.io/networks/ipfs). For development purposes, this repository uses the following RPC to fetch mainnet and testnet data:

- IPFS Gateway: `https://api.universalprofile.cloud/ipfs`

> LUKSO does not provide an official gateway for uploading asset data.
