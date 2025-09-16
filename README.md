# 🤹 LUKSO Playground

A comprehensive development playground for building on the LUKSO blockchain. This repository contains both DApp examples and smart contract templates to help you get started with LUKSO's [LSP](https://docs.lukso.tech/standards/standards-roadmap) standards.

## 🚀 Getting Started

### Prerequisites

**This repository uses the [bun](https://bun.sh) toolkit to manage packages and run scripts. Make sure to [install it](https://bun.sh/docs/installation) first.**

### Installation

Clone this repository and install its dependencies:

```bash
git clone https://github.com/lukso-network/lukso-playground.git
cd lukso-playground && bun install
```

## 📁 Project Structure

### 🌐 DApps (`/dapps`)

Interactive examples and scripts demonstrating LUKSO standards integration:

- **[`universal-profile`](./dapps/universal-profile)**: Universal Profile related scripts
- **[`digital-assets`](./dapps/digital-assets)**: Digital assets (LSP7/8) scripts  
- **[`interface-detection`](./dapps/interface-detection)**: Verify EIP165 Standard Compatibility
- **[`key-manager`](./dapps/key-manager)**: Permission Management of Controller Keys
- **[`metadata-detection`](./dapps/metadata-detection)**: Verify ERC725Y Storage Compatibility
- **[`transfer-lyx`](./dapps/transfer-lyx)**: Coin Transfers for Backend and Extension
- **[`universal-factory`](./dapps/universal-factory)**: Universal Factory related scripts

#### Running DApp Examples

Run any DApp script from the root directory:

```bash
bun run dapps/universal-profile/fetch-json-data.ts
```

See the [DApps README](./dapps/README.md) for detailed usage instructions.

### 🔨 Smart Contracts (`/smart-contracts`)

Hardhat-based smart contract development environment with deployment scripts and examples:

- **Contract Templates**: Ready-to-use LSP smart contract implementations
- **Deployment Scripts**: Automated deployment workflows
- **Verification Tools**: Contract verification utilities
- **Testing Suite**: Comprehensive test coverage

#### Working with Smart Contracts

Navigate to the smart-contracts directory for contract development:

```bash
cd smart-contracts
# Install contract-specific dependencies
bun install
# Compile contracts
bun run compile
# Run tests
bun run test
# Deploy contracts
bun run deploy
```

See the [Smart Contracts README](./smart-contracts/README.md) for detailed development instructions.

## 🛠️ Key Technologies

### LUKSO Libraries

- **[`@erc725/erc725.js`](https://docs.lukso.tech/tools/erc725js/getting-started)**: Library for interacting with ERC725 contracts
- **[`@lukso/lsp-smart-contracts`](https://docs.lukso.tech/tools/lsp-smart-contracts/getting-started)**: LUKSO Standard Proposals smart contract implementations

### Development Tools

- **[Bun](https://bun.sh)**: Fast all-in-one JavaScript runtime and toolkit
- **[Hardhat](https://hardhat.org)**: Ethereum development environment
- **[TypeScript](https://www.typescriptlang.org)**: Type-safe JavaScript development

## 🌍 Network Configuration

### LUKSO Networks

- **Mainnet**: `https://rpc.mainnet.lukso.network`
- **Testnet**: `https://rpc.testnet.lukso.network`

### IPFS Gateway

For development purposes, this repository uses:
- **IPFS Gateway**: `https://api.universalprofile.cloud/ipfs`

> ⚠️ **Production Recommendation**: We highly recommend that developers use their own IPFS gateway solutions like [Pinata](https://docs.pinata.cloud/docs/welcome-to-pinata) or [Infura](https://docs.metamask.io/services/how-to/use-ipfs/access-ipfs-content/) for production applications.

## 📖 Documentation

- [LUKSO Tech Docs](https://docs.lukso.tech/)
- [LSP Standards](https://docs.lukso.tech/standards/introduction/)
- [Universal Profile](https://docs.lukso.tech/standards/accounts/introduction/)
- [Digital Assets](https://docs.lukso.tech/standards/tokens/introduction/)

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guidelines](./CONTRIBUTING.md) for details on how to get started.