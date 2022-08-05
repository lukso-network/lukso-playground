const { ethers } =  require("hardhat");


const deployGreeter = async ({deployments, getNamedAccounts}) => {
  const { deploy } = deployments;
  const { owner } = await getNamedAccounts();

  await deploy("Greeter", {
    from: owner,
    args: ["Hello, Hardhat!"],
    gasPrice: ethers.BigNumber.from(20_000_000_000),
    log: true
  });
}

module.exports = deployGreeter;
module.exports.tags = ["Greeter"];
