# LSP HardHat Integration

This project is used as a guide to show how to setup HardHat to interact with **[LSPs](https://docs.lukso.tech/contracts/introduction)** smart contracts on **[LUKSO networks](https://docs.lukso.tech/networks/mainnet/parameters)**.

## Guides

- [Getting started with HardHat on LUKSO](https://docs.lukso.tech/learn/smart-contract-developers/getting-started)
- [Create, deploy, and verify an LSP7 token](https://docs.lukso.tech/learn/smart-contract-developers/create-lsp7-token)

## Setup

**This Hardhat repository uses the [bun](https://bun.sh) package manager. Make sure to [install it](https://bun.sh/docs/installation) first.**

Install the dependencies

```bash
bun install
```

## Development

### Compile Contracts

Compile all smart contracts within `/contracts`:

```bash
bun hardhat compile
```

> **INFO** Add the `--verbose` and `--show-stack-traces` flags for further information.

### Deploy Contracts

Create a `.env` file and put the private key of your deployer address inside it.

```bash
cp .env.example .env
```

Deploy a sample LSP7 token with an Externally Owned Account:

> **Note:** make sure to add the private key of an EOA for deployment on the `.env` file.

```bash
bun hardhat --network luksoTestnet run scripts/deployTokenAsEOA.ts
```

Deploy a sample LSP7 token with a Universal Profile:

> **Note:** if you are using the script `deployTokenAsUP` or `deployTokenWithMetadataAsUP` to deploy as a Universal Profile, you must provide the private key of a controller of your Universal Profile in the `.env` file.

```bash
bun hardhat --network luksoTestnet run scripts/deployTokenAsUP.ts
```

> **INFO** Adjust the network and token name within the command and script.

### Verify Contracts

Verify your contracts with the blockscout API and their constructor parameters (you must fill the fields in the file [`./verify/myCustomToken.ts`](./verify/myCustomToken.ts) with the correct parameters used on
deployment).

```bash
bun hardhat verify <myContractAddress> --constructor-args ./verify/myCustomToken.ts --network luksoTestnet
```

## Packages

- [`hardhat`](https://hardhat.org/docs): Smart contract development environment
- [`@nomiclabs/hardhat-toolbox`](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox): Test, deploy, and verify contracts
- [`@lukso/lsp-smart-contracts`](https://docs.lukso.tech/tools/lsp-smart-contracts/getting-started): LUKSO smart contract collection
- [`dotenv`](https://www.npmjs.com/package/dotenv): Manage private deployer information
- [`prettier`](https://www.npmjs.com/package/prettier): Code Formatting
