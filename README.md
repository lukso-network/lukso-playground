```
project
│   README.md
│   file001.txt    
│
└───folder1
│   │   file011.txt
│   │   file012.txt
│   │
│   └───subfolder1
│       │   file111.txt
│       │   file112.txt
│       │   ...
│   
└───folder2
    │   file021.txt
    │   file022.txt
```

# lukso-playground
 
Convenient and standalone code snippets to interact with [LSP](https://docs.lukso.tech/standards/standards-roadmap) standards.

## Last Playground Check

24th June 2022

## Contents

### Tags
- `legacy:` Working with legacy profiles on [universalprofile.cloud](https://universalprofile.cloud/)
- `current:` Latest standard that will be deployed to mainnet
- `none:` using latest version of erc725.js

### Folders

```
project
│
└───convenience                                     // Utility Functions
│   │   Check Blockchain Addresses
│   │   Create Externally Owned Account
│   
└───create-asset                                    // Create UP
│   │   Create Universal Profile
|
└───create-profile                                  // Create LSP7 & LSP8
│   │   Work in Progress
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
    │   Fetch Universal Receiver
    │   Read Profile Data
    │   Read Profile Metadata
    │   Complete Profile Guide

```

### Used ERC725.js Build

Version 0.14.0

### IPFS Server

- https://cloudflare-ipfs.com/ipfs/
- https://2eff.lukso.dev/ipfs/

### Run locally

```
npm install
node [FILENAME].js
```