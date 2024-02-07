# Basic Sample Hardhat Project

This project is used as a guide to show how to setup HardHat to work with the **[LUKSO networks](https://docs.lukso.tech/networks/mainnet/parameters)** and **[LSPs](https://docs.lukso.tech/contracts/introduction)**.

[HardHat](https://hardhat.org/docs) is a development environment to:

- **create** and **edit**
- **compile** and **debug**
- **deploy** and **verify**

smart contracts on EVM based blockchains.

## Guides

- [Getting started with HardHat on LUKSO](https://docs.lukso.tech/learn/smart-contract-developers/getting-started)
- [Create, deploy, and verify an LSP7 token](https://docs.lukso.tech/learn/smart-contract-developers/create-lsp7-token)

## Setup

Install the dependencies

```bash
bun install
```

Set the private environment variables

```bash
cp .env.example .env
```

> **INFO** Make sure to add the private key of an EOA for deployment. Optionally, you can provide a private key of a controller and a Universal Profile address to deploy contracts using your smart contract account.

## Development

### Compile Contracts

Enforce the compilation of contracts and display the stack traces:

```bash
npm run build
```

Regular compilation of your smart contracts:

```bash
npx hardhat compile
```

> **INFO** Add the `--verbose` and `--show-stack-traces` flags for further information.

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
npx hardhat verify myTokenAddress --constructor-args ./verify/myTokenName.ts --network luksoTestnet
```

## Packages

- [`hardhat`](https://hardhat.org/docs): Smart contract development environment
- [`@nomiclabs/hardhat-toolbox`](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox): Test, deploy, and verify contracts
- [`@lukso/lsp-smart-contracts`](https://docs.lukso.tech/tools/lsp-smart-contracts/getting-started): LUKSO smart contract collection
- [`dotenv`](https://www.npmjs.com/package/dotenv): Manage private deployer information
- [`prettier`](https://www.npmjs.com/package/prettier): Code Formatting
