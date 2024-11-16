# LSP HardHat Integration

This project is used as a guide to show how to setup HardHat to interact with **[LSPs](https://docs.lukso.tech/contracts/introduction)** smart contracts on **[LUKSO networks](https://docs.lukso.tech/networks/mainnet/parameters)**.

## Guides

- [Getting started with HardHat on LUKSO](https://docs.lukso.tech/learn/smart-contract-developers/getting-started)
- [Create, deploy, and verify an LSP7 token](https://docs.lukso.tech/learn/smart-contract-developers/create-lsp7-token)

## Setup

**This Hardhat repository uses the [bun](https://bun.sh) package manager. Make sure to [install it](https://bun.sh/docs/installation) first.**

Follow the instructions below in your terminal to get started using the smart contracts and running the script examples.

> **Requirement:** Make sure to add the private key of an EOA for deployment. Optionally, you can provide a private key of a controller and a Universal Profile address to deploy contracts using your smart contract account.
> **Tips:** Add the `--verbose` and `--show-stack-traces` flags for further information.

```bash
# 1. Install the dependencies
bun install

# 2. Set the private environment variables in your .env file
cp .env.example .env

# 3. Compile all smart contracts within `/contracts`:
bun run build
```

## Development

### Compile Contracts

```bash
bun run build
```

### Deploy Contracts

Deploy a sample LSP7 contract with an Externally Owned Account:

```bash
npx hardhat --network luksoTestnet run scripts/deployEOA.ts
```

Deploy a sample LSP7 contract with a Universal Profile:

```bash
npx hardhat --network luksoTestnet run scripts/deployUP.ts
```

> **INFO** Adjust the network and token name within the command and script.

### Verify Contracts

Verify your contracts with the blockscout API and their constructor parameters:

```bash
npx hardhat verify <myContractAddress> --constructor-args ./verify/myCustomToken.ts --network luksoTestnet
```

## Packages

- [`hardhat`](https://hardhat.org/docs): Smart contract development environment
- [`@nomiclabs/hardhat-toolbox`](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox): Test, deploy, and verify contracts
- [`@lukso/lsp-smart-contracts`](https://docs.lukso.tech/tools/lsp-smart-contracts/getting-started): LUKSO smart contract collection
- [`dotenv`](https://www.npmjs.com/package/dotenv): Manage private deployer information
- [`prettier`](https://www.npmjs.com/package/prettier): Code Formatting
