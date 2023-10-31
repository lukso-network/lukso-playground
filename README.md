# lukso-playground

Convenient and standalone code snippets to interact with [LSP](https://docs.lukso.tech/standards/standards-roadmap) standards.

## Foundation

Snippets were taken from [LUKSO Tech Docs](https://docs.lukso.tech/) and work completely autonomously.

## Last Playground Check

301h October 2023

### IPFS Server

`https://api.universalprofile.cloud/ipfs` (LUKSO Testnet)

## Contents

```
project
│
├── convenience                                     // Utility Functions
│   ├── Check Blockchain Addresses
│   └── Create Externally Owned Account
│
├── create-profile                                  // Create UP
│   └── Create Universal Profile
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
├── get-profile-data                                // Receive Profile Info
│   ├── Get the Data Keys
│   ├── Fetch the Metadata
│   ├── Fetch the Owned Assets
│   ├── Fetch the Issued Assets
│   └── Fetch the Universal Receiver
│
├── hardhat-deploy                                  // SC Deployment Setup
│   ├── Sample Contract
│   └── Scripts
|
├── interface-detection                             // Verify SC Functionality
|   └── ERC165 Interface Check
│
├── key-manager                                     // Permission Management
│   ├── Manage 3rd party permissions (WIP)
│   ├── Get controller key (WIP)
│   └── Set UP Permissions to Address
|
├── metadata-detection                              // Verify SC Storage
|   ├── Universal Profile Storage
|   ├── Digital Asset Storage
|   └── Vault Storage
│
├── transfer-lyx                                    // Value Transfer
│   └── Regular transaction (Extension)
│   └── Backend transaction (Smart Contract)
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
