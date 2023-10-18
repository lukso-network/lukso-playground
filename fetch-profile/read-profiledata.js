import { ERC725 } from '@erc725/erc725.js';

// Initatiate erc725.js
const erc725js = new ERC725([], myProfileAddress, 'https://rpc.lukso.gateway.fm', {
  ipfsGateway: 'https://ipfs-proxy.lukso-account.workers.dev/ipfs/',
});

// Fetch all profile data
let profileData = await erc725js.getData()