import { ethers } from 'ethers';

const RPC_URL = 'https://rpc.testnet.lukso.network';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const checkDeployedCode = async (address: any) => {
  const code = await provider.getCode(address);
  return code !== '0x';
};

// Fixed addresses

// For more information check: https://github.com/Arachnid/deterministic-deployment-proxy
const NICK_FACTORY_ADDRESS = '0x4e59b44847b379578588920ca78fbf26c0b4956c';

// For more information check: https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-16-UniversalFactory.md
const LSP16_FACTORY_ADDRESS = '0x1600016e23e25D20CA8759338BfB8A8d11563C4e';

const isNickFactoryDeployed = await checkDeployedCode(NICK_FACTORY_ADDRESS);
const isLSP16FactoryDeployed = await checkDeployedCode(LSP16_FACTORY_ADDRESS);

console.log('Nick Factory exists: ', isNickFactoryDeployed);
console.log('LSP16UniversalFactory exists: ', isLSP16FactoryDeployed);
