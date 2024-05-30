import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { config } from "dotenv";

config()
const builder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
// export const isTestnet = process.env.CONTEXT === "TESTNET";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, getNetworkName} = deployments;
	const {deployer, cUSD, other} = await getNamedAccounts();

  const deployTestSupportedAssets = async() => {
    let supportedAssets : string[] = [];
    const assetCase = builder.map((i) => {
      return {
        name: `Token${i}`,
        symbol: `TNT${i}`
      }
    });
    
    console.log("assetCase", assetCase);
    for(let i = 0; i < assetCase.length; i++) {
      const name = assetCase[i].name;
      const symbol = assetCase[i].symbol;
      const deployed = await deploy("TestToken", {
        from: deployer,
        args: [name, symbol, other],
        log: true,
      });
      supportedAssets.push(deployed.address);
      console.log(`${name} deployed to`, deployed.address);
    }
    console.log("supportedAsset", supportedAssets);
    return supportedAssets;
  }

  const networkName = getNetworkName();
  console.log("Network Name", networkName); 

  const feeReceiver = await deploy("FeeReceiver", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log("TFeeReceiver address", feeReceiver.address);

  const supportedAssets = await deployTestSupportedAssets();
  const registry = await deploy("Registry", {
    from: deployer,
    args: [supportedAssets, builder, cUSD, feeReceiver.address],
    log: true,
  });
  console.log("Registry address", registry.address);
  

};

export default func;

func.tags = ["TestToken", "Registry", "feeReceiver",];
