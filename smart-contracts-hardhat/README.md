# Basic Sample Hardhat Project

This project is used as a guide to show how to setup HardHat to work with the **[LUKSO networks](https://docs.lukso.tech/networks/mainnet/parameters)** and **[LSPs](https://docs.lukso.tech/contracts/introduction)**.

[HardHat](https://hardhat.org/docs) is a development environment to:

- **create** and **edit**
- **compile** and **debug**
- **deploy** and **verify**

smart contracts on EVM based blockchains.

> Further information can be found on our [Hardhat Guide](https://docs.lukso.tech/learn/smart-contract-developers/getting-started).

## Setup

Install the dependencies

```bash
bun install
```

Set the private environment variables

```bash
cp .env.example .env
```

> **INFO** Make sure to add the private key of an EOA for deployment. Optionally, you can provide a private key of a controller and a Universal Profile address to deploy via profile.

## Development

### Compile Contracts

Enforce compilation of contracts, and display the detailed stack traces for debugging.

```bash
npm run build
```

Regular compilation of your smart contracts.

```bash
npx hardhat compile
```

> **INFO** Add the `--verbose` and `--show-stack-traces` flags for further information

### Deploy Scripts

Deploy a contract as an Externally Owned Account (EOA)

```bash
npx hardhat --network luksoTestnet run scripts/deployEOA.ts
```

Deploy a contract as a Universal Profile (UP)

```bash
npx hardhat --network luksoTestnet run scripts/deployUP.ts
```

> **INFO** Adjust the network and token name within the command and script.

### Verify Contracts

```bash
npx hardhat verify myTokenAddress --constructor-args ./verify/myTokenName.ts --network luksoTestnet
```

## Getting Started

The syntax of smart contracts works by **inheritance**, using underlying functionalities to smart contract objects. If you create a new smart contract using LSPs, you can `import` standardized and modular presets from the `@lukso/lsp-smart-contracts` developer library. Such presets can then be combined to create complex contract deployments like Universal Profiles and Digital Assets.

For example, you can import `LSP7Mintable` to create a LSP7 contract that enables the contract owner to mint these tokens like the following:

```js
// contracts/MyTokens/MyCustomToken.sol
import { LSP7Mintable } from '@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/presets/LSP7Mintable.sol';
```

### Inherit LSP functionality

```js
// contracts/MyTokens/MyCustomToken.sol
...

contract MyToken is LSP7Mintable {
    // custom smart contract logic ...
}
```

### Specify standardized parameters

After inheriting, the contract might expect mandatory parameters to fullfil the standardization. In case of `LSP7Mintable`, you must define a set of default parameters in the constructor of the smart contract, defined during the contracts deployment:

- its name
- its symbol
- the address that control the token
- the type of asset it is (Token, NFT or Collection)
- if the token can be divided in fractional units (LSP7 specific)

```js
// contracts/MyTokens/MyCustomToken.sol
...

contract MyToken is LSP7Mintable {
  constructor(
      string memory name,
      string memory symbol,
      address contractOwner,
      uint256 lsp4TokenType,
      bool isNonDivisible
  ) LSP7Mintable(
      name,
      symbol,
      contractOwner,
      lsp4TokenType,
      isNonDivisible,
  ) {
  }
  // custom smart contract logic
}
```

### Add the deployment scripts

You can either write properties directly **into the Solditity contract** or **pass them from the deployment scripts**.

```js
// scripts/deployEOA.ts
import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

dotenv.config();

async function deployToken() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const token = await ethers.deployContract('MyToken', [
    'My Custom Token', // token name
    'MCT', // token symbol
    deployer.address, // contract owner
    0, // token type = TOKEN
    false, // isNonDivisible?
  ]);

  console.log('Token address:', await token.getAddress());
}

deployToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

You can run the deployment script [as described above](#deploy-scripts).

### Interact with contract storage

After the token was deployed, you can access and edit the token's metadata on the storage:

```js
// scripts/deployEOA.ts
...

import { LSP4_TOKEN_TYPES, ERC725YDataKeys } from '@lukso/lsp-smart-contracts';

async function deployToken() {

  ...

  // Read the token metadata
  const metadata = await token.getData(ERC725YDataKeys.LSP4['LSP4Metadata']);
  console.log('Token metadata:', metadata);

  // Write token metadata (should be a VerifiableURI)
  const tx = await token.setData(
    ERC725YDataKeys.LSP4['LSP4Metadata'],
    '0xcafecafe',
  );

  // Fetch the transaction receipt
  const receipt = await tx.wait();
  console.log('Token metadata updated:', receipt);
}

...
```

> **Info** You can only set one file as `VerifiableURI` for a token. This file will include all the data and media references. If you want to update individual properties, please get the latest contents of a contract's storage key, modify specific properties, and reupload the full file. This can then be used to edit the storage by calling the `setData()` function.

### Verify deployed contracts

To verify a deployed contract, you can use the blockscout API properties set up within the `hardhat.config.ts` of this repository. You then have to pass a file with all the constructor arguments that you've defined when deploying the smart contract. The parameters and compiled contract code are is then used to verify if it matches the payload of the deployed contract. You can find an example within [`/verify/myCustomToken.ts`](./verify/myCustomToken.ts)

You can run the verification script as [described above](#verify-contracts).

## Packages

- [`hardhat`](https://hardhat.org/docs): Smart contract development environment
- [`@nomiclabs/hardhat-toolbox`](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox): Test, deploy, and verify contracts
- [`@lukso/lsp-smart-contracts`](https://docs.lukso.tech/tools/lsp-smart-contracts/getting-started): LUKSO smart contract collection
- [`dotenv`](https://www.npmjs.com/package/dotenv): Manage private deployer information
- [`prettier`](https://www.npmjs.com/package/prettier): Code Formatting
