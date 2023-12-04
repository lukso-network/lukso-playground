# lukso-playground

Convenient code snippets to interact with [LSP](https://docs.lukso.tech/standards/standards-roadmap) standards on LUKSO. Code examples are taken from the [Official LUKSO Tech Docs](https://docs.lukso.tech/) and are working as standalone scripts.

### IPFS Servers

- LUKSO Testnet
  - `https://api.universalprofile.cloud/ipfs` (`Download`)
  - `api.2eff.lukso.dev:443` (`Upload`)

## Contents

- [`convenience`](./convenience): Address Checks and EOA creation
- [`create-profile`](./create-profile): Universal Profile Creation
- [`extract-data`](./extract-data): Extract LSP3 and LSP4 JSON Data
- [`fetch-asset`](./fetch-asset): Asset-related Data Fetches and Operations
- [`fetch-profile`](./fetch-profile): Asset-related Data Fetches and Operations
- [`hardhat-deploy`](./hardhat-deploy): Smart Contract Deployment Setup and Scripts
- [`interface-detection`](./interface-detection): Verify EIP165 Standard Compatibility
- [`key-manager`](./key-manager): Permission Management of Controller Keys
- [`metadata-detection`](./metadata-detection): Verify ERC725Y Storage Compatability
- [`transfer-lyx`](./transfer-lyx): Coin Transfers for Backend and Exetnsion
- [`transfer-token`](./transfer-token/): Token Transfers for Backend and Exetnsion
- [`update-profile`](./update-profile/): Update Universal Profile Data

### LUKSO Libraries

- `@erc725/erc725.js`: 0.19.0
- `@lukso/lsp-factory.js`: 3.1.1
- `@lukso/lsp-smart-contracts`: 0.11.1

## Development

Clone this repository and install its dependencies.

```bash
git clone https://github.com/lukso-network/lukso-playground.git
```

```
cd lukso-playground && npm i
```

### Run locally

Run the JavaScript code of one file within the terminal.

```bash
node [FILENAME].js
```
Note: Requires node<v19

### Run in browser

Open this project on [StackBlitz](https://stackblitz.com/github/lukso-network/lukso-playground) and start coding right away.
