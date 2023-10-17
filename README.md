# lukso-playground

Convenient and standalone code snippets to interact with [LSP](https://docs.lukso.tech/standards/standards-roadmap) standards.

## Foundation

Snippets were taken from [LUKSO Tech Docs](https://docs.lukso.tech/) and work completely autonomously.

## Last Playground Check

17th October 2023

### IPFS Server

`https://ipfs-proxy.lukso-account.workers.dev/ipfs/` (LUKSO Testnet)

## Contents

```
project
│
├── convenience                                     // Utility Functions
│   ├── Check Blockchain Addresses
│   └── Create Externally Owned Account
│
├── create-asset                                    // Create LSP7 & LSP8
│   └── WIP
│
├── create-profile                                  // Create UP
│   └── Create Universal Profile
│
├── create-vault                                    // Create UP
│   └── WIP
│
├── extract-data                                    // Extract LSP JSON
│   ├── Extract Data from Asset JSON
│   └── Extract Data from Profile JSON
│
├── fetch-asset                                     // Fetch LSP7 & LSP8
│   ├── Fetch Owned Assets
│   ├── Fetch Asset Data
│   └── Complete Asset Guide
│
├── fetch-profile                                   // Fetch UP
│   ├── Fetch Universal Receiver
│   ├── Read Profile Data
│   ├── Read Profile Metadata
│   └── Complete Profile Guide
│
├── hardhat-deploy                                  // SC Deployment Setup
│   ├── Sample Contract
│   └── Scripts
│
├── key-manager                                     // Permission Management
│   ├── Manage 3rd party permissions (WIP)
│   ├── Get controller key (WIP)
│   └── Set UP Permissions to Address
│
├── transfer-lyx                                    // Value Transfer
│   └── Complete Transfer Guide
│
└── update-profile                                  // Update UP
    └── Complete Update Guide
```

### LUKSO Developer Libraries

- `@erc725/erc725.js`: 0.19.0
- `@lukso/lsp-factory.js`: 3.1.1
- `@lukso/lsp-smart-contracts`: 0.11.1

> @erc725/erc725.js only supports web3 up to version @1.10.0

## Deplyment

Clone this repository and install its dependencies.

```
git clone https://github.com/lukso-network/lukso-playground.git
cd lukso-playground
npm install
```

### Run locally

Run the JavaScript code of one file within the terminal.

```
node [FILENAME].js
```

### Run in browser

Open this project on [StackBlitz](https://stackblitz.com/github/lukso-network/lukso-playground) and start coding right away.
