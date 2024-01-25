# 🤹 LUKSO Playground

Convenient code snippets to interact with [LSP](https://docs.lukso.tech/standards/standards-roadmap) standards on LUKSO. Code examples are taken from the [LUKSO Tech Docs](https://docs.lukso.tech/) and are working as standalone scripts.

### IPFS Servers

We highly recommend that developers fetch and store profile or asset data using **their own IPFS gateway** solutions like [Pinata](https://docs.pinata.cloud/docs/welcome-to-pinata) or [Infura](https://docs.infura.io/networks/ipfs). For development purposes, this repository uses the following RPC to fetch mainnet and testnet data:

- IPFS Gateway: `https://api.universalprofile.cloud/ipfs`

> LUKSO does not provide an official gateway for uploading asset data.

## Contents

- [`convenience`](./convenience): Address Checks and EOA creation
- [`create-profile`](./create-profile): Universal Profile Creation
- [`extract-data`](./extract-data): Extract LSP3 and LSP4 JSON Data
- [`fetch-asset`](./fetch-asset): Asset-related Data Fetches and Operations
- [`fetch-profile`](./fetch-profile): Profile-related Data and Controller Fetches
- [`hardhat-deploy`](./hardhat-deploy): Smart Contract Deployment Setup and Scripts
- [`interface-detection`](./interface-detection): Verify EIP165 Standard Compatibility
- [`key-manager`](./key-manager): Permission Management of Controller Keys
- [`metadata-detection`](./metadata-detection): Verify ERC725Y Storage Compatability
- [`transfer-lyx`](./transfer-lyx): Coin Transfers for Backend and Exetnsion
- [`transfer-token`](./transfer-token/): Token Transfers for Backend and Exetnsion
- [`update-profile`](./update-profile/): Update Universal Profile Data

### LUKSO Libraries

- [`@erc725/erc725.js`](https://docs.lukso.tech/tools/erc725js/getting-started): 0.22.0
- [`@lukso/lsp-factory.js`](https://docs.lukso.tech/tools/lsp-factoryjs/getting-started): 3.1.1
- [`@lukso/lsp-smart-contracts`](https://docs.lukso.tech/tools/lsp-smart-contracts/getting-started): 0.14.0

## Development

Clone this repository and install its dependencies.

```bash
git clone https://github.com/lukso-network/lukso-playground.git

cd lukso-playground && npm i
```

### Run locally

Run the JavaScript code of one file within the terminal.

```bash
node [FILENAME].js
```

> Requires NodeJS `version < 19.0.0`

### Run in browser

Open this project on [StackBlitz](https://stackblitz.com/github/lukso-network/lukso-playground) and start coding right away.
