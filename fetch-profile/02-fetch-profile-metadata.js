// Import and Network Setup
import Web3 from 'web3';
import { ERC725 } from '@erc725/erc725.js';
import 'isomorphic-fetch'; // To enable you to use fetch() in Node.js code

// Our static variables
const SAMPLE_PROFILE_ADDRESS = '0x6979474Ecb890a8EFE37daB2b9b66b32127237f7';
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.network';
const IPFS_GATEWAY = 'https://api.universalprofile.cloud/ipfs';

// Parameters for ERC725 Instance
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

async function fetchProfile(address) {
  try {
    const profile = new ERC725(
      [
        {
          name: 'LSP3Profile',
          key: '0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5',
          keyType: 'Singleton',
          valueType: 'bytes',
          valueContent: 'JSONURL',
        },
      ],
      address,
      provider,
      config,
    );
    return await profile.fetchData();
  } catch (error) {
    console.log(error);
    return console.log('This is not an ERC725 Contract');
  }
}

// Debug
fetchProfile(SAMPLE_PROFILE_ADDRESS).then((profileData) =>
  console.log(JSON.stringify(profileData, undefined, 2)),
);
