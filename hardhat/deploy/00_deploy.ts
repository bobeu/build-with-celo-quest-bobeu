import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

export const isTestnet = process.env.CONTEXT === "TESTNET";
console.log("isTEstnet: ", isTestnet);

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, getNetworkName} = deployments;
	const {deployer, cUSD} = await getNamedAccounts();

  const networkName = getNetworkName();
  console.log("Network Name", networkName); 

  const feeReceiver = await deploy("FeeReceiver", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log("TestToken address", feeReceiver.address);
  
  const testToken = await deploy("TestToken", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log("TestToken address", testToken.address);
  
  const registry = await deploy("Registry", {
    from: deployer,
    args: [[testToken.address], cUSD, feeReceiver.address],
    log: true,
  });
  console.log("Registry address", registry.address);
  

};

export default func;

func.tags = ["TestToken", "Registry", "feeReceiver"];
