# Basic sample hardhat project

This project is used as a guide to show how to setup hardhat to work with LUKSO. You can find more info here: [Hardhat guide](https://docs.lukso.tech/guides/hardhat-walkthrough/hardhat-base-setup)

```bash
npm i
touch .env # provide the value for PRIVATE_KEY and UP_ADDR
npm run build
npx hardhat --network luksoTestnet run scripts/deployEOA.ts # deploy the customToken contract as an EOA
npx hardhat --network luksoTestnet run scripts/deployUP.ts # deploy the customToken contract as a UP
```
