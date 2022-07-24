# lukso-playground
 
Convenient and standalone code snippets to interact with [LSP](https://docs.lukso.tech/standards/standards-roadmap) standards.

## Foundation

Most snippets were taken from [LUKSO Tech Docs](https://docs.lukso.tech/) and work completely autonomously.

## Last Playground Check

27th June 2022

## Contents

### Tags
- `legacy:` Legacy LSP standards on L14 ([universalprofile.cloud](https://universalprofile.cloud/))
- `current:` Latest LSP standards on L16
- `none:` using latest standards and version of erc725.js

### Folders

```
project
│
└───convenience                                     // Utility Functions
│   │   Check Blockchain Addresses
│   │   Create Externally Owned Account
│   
└───create-asset                                    // Create LSP7 & LSP8
│   │   Work in Progress ...
|
└───create-profile                                  // Create UP
│   │   Create Universal Profile
|
└───extract-data                                    // Extract LSP JSON
│   │   Extract Data from Asset JSON
│   │   Extract Data from Profile JSON
|
└───fetch-asset                                     // Fetch LSP7 & LSP8
│   │
│   └───current/legacy
│       │   Fetch Universal Receiver
│       │   Fetch Received Assets
│       │   Fetch Issued Assets
│       │   Fetch Owned Assets
│       │   Check Asset Interface
│       │   Get the Assets Encoded Data
│       │   Get the Assets Decoded Data
│       │   Get the Assets Storage Link
│       │   Fetch the Assets Storage
│       │   Complete Asset Guide
|
└───fetch profile                                   // Fetch UP
|   │   Fetch Universal Receiver
|   │   Read Profile Data
|   │   Read Profile Metadata
|   │   Complete Profile Guide
|    
└───permissions                                     // Key Manager
|   │   Set UP Permissions to Address
|    
└───transfer LYX                                    // Value Transfer
|   │   Complete Transfer Guide
|
└───update profile                                  // Update UP
    │   Complete Update Guide

```

### Used ERC725.js Build

Version 0.14.0

### IPFS Server

- https://cloudflare-ipfs.com/ipfs/
- https://2eff.lukso.dev/ipfs/

### Run locally

Clone this repository and install its dependencies.

```
git clone https://github.com/lukso-network/lukso-playground.git
cd lukso-playground
npm install
```

Run the JavaScript code of one file within the terminal.

```
node [FILENAME].js
```

### Run in browser

Open this project on [StackBlitz](https://stackblitz.com/github/lukso-network/lukso-playground) and start coding right away.
