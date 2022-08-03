// Static variables
const RPC_ENDPOINT = "https://rpc.l16.lukso.network";
const CHAIN_ID = 2828;
const PRIVATE_KEY = "0x..."; // add the private key of your EOA from ../convenience/create-eoa.js

// Import and Network Setup
const { LSPFactory } = require("@lukso/lsp-factory.js");
const Web3 = require("web3");
const web3 = new Web3(RPC_ENDPOINT);

// Step 3.1 - Load our Externally Owned Account (EOA)
const myEOA = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

// Step 3.2
// Initialize the LSPFactory with the L14 RPC endpoint and your EOA's private key, which will deploy the UP smart contracts
const lspFactory = new LSPFactory(RPC_ENDPOINT, {
  deployKey: PRIVATE_KEY,
  chainId: CHAIN_ID,
});

// Step 3.3 - Deploy our Universal Profile
async function createUniversalProfile() {
  const deployedContracts = await lspFactory.UniversalProfile.deploy({
    controllingAccounts: [myEOA.address], // our EOA that will be controlling the UP
    lsp3Profile: {
      name: "My Universal Profile",
      description: "My Cool Universal Profile",
      tags: ["Public Profile"],
      links: [
        {
          title: "My Website",
          url: "https://my-website.com",
        },
      ],
    },
  });

  const myUPAddress = deployedContracts.LSP0ERC725Account.address;
  console.log("my Universal Profile address: ", myUPAddress);

  return deployedContracts;
}

createUniversalProfile();
