// Imports
import { ethers } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';
import { LSPFactory } from '@lukso/lsp-factory.js';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json' assert { type: 'json' };
import KeyManager from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json' assert { type: 'json' };

// Static variables
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.gateway.fm';
const IPFS_GATEWAY = 'https://api.universalprofile.cloud/ipfs';
const CHAIN_ID = 2828;
const PRIVATE_KEY = '0x...'; // Replace with your private key
const UNIVERSAL_PROFILE_ADDRESS = '0x...'; // Replace with the Universal Profile address

// Connect to the provider
const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

// Create a new LSP3Profile JSON file
import jsonFile from './sample-metadata.json' assert { type: 'json' };

(async () => {
  try {
    // Upload our JSON file to IPFS
    const lspFactory = new LSPFactory(provider, {
      deployKey: PRIVATE_KEY,
      chainId: CHAIN_ID,
    });
    const uploadResult = await lspFactory.UniversalProfile.uploadProfileData(
      jsonFile.LSP3Profile,
    );

    const lsp3ProfileIPFSUrl = uploadResult.url;

    // Setup erc725.js
    const schema = [
      {
        name: 'LSP3Profile',
        key: '0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5',
        keyType: 'Singleton',
        valueContent: 'JSONURL',
        valueType: 'bytes',
      },
    ];

    const erc725 = new ERC725(schema, UNIVERSAL_PROFILE_ADDRESS, provider, {
      ipfsGateway: IPFS_GATEWAY,
    });

    // Encode the LSP3Profile data (to be written on our UP)
    const encodedData = erc725.encodeData({
      keyName: 'LSP3Profile',
      value: {
        hashFunction: 'keccak256(utf8)',
        // Hash our LSP3 metadata JSON file
        hash: ethers.utils.keccak256(JSON.stringify(jsonFile)),
        url: lsp3ProfileIPFSUrl,
      },
    });

    // Load our EOA
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log('EOA:', wallet.address);

    // Create instances of our Contracts
    const universalProfileContract = new ethers.Contract(
      UNIVERSAL_PROFILE_ADDRESS,
      UniversalProfile.abi,
      wallet,
    );

    const keyManagerAddress = await universalProfileContract.owner();
    const keyManagerContract = new ethers.Contract(
      keyManagerAddress,
      KeyManager.abi,
      wallet,
    );

    // Set updated LSP3Profile metadata to our Universal Profile

    // encode the setData payload
    const abiPayload = universalProfileContract.interface.encodeFunctionData(
      'setData',
      [encodedData.keys, encodedData.values],
    );

    // Execute via the KeyManager, passing the UP payload
    await keyManagerContract.execute(abiPayload, { gasLimit: 300000 });
    console.log('Profile data updated successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
})();
