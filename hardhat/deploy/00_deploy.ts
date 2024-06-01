import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { config } from "dotenv";

config()
let builder : number[] = [];

// Tokens already deployed to mainnet
const testToken1 = "0x409e23a02AC0e8eEa44B504B01fc6f672f624Fca";
const testToken2 = "0x7885F497c2b2b5096b92b70a31aEEb74070A4e69";
const cusdMain = "0x765de816845861e75a25fca122bb6898b8b1282a";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, getNetworkName} = deployments;
	const {deployer, cUSD, other} = await getNamedAccounts();
  const isMainnet = cUSD.toLowerCase() === cusdMain.toLowerCase();
  builder = isMainnet? [0, 1]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const deployTestSupportedAssets = async() => {
    let supportedAssets : string[] = [];
    const assetCase = builder.map((i) => {
      return {
        name: `Token${i}`,
        symbol: `TNT${i}`
      }
    });
    
    console.log("assetCase", assetCase);
    if(isMainnet) {
      supportedAssets = [testToken1, testToken2]
    } else {
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
  const registry = await deploy(isMainnet? "RegistryMain" : "Registry", {
    from: deployer,
    args: [supportedAssets, builder, cUSD, feeReceiver.address],
    log: true,
  });
  console.log("Registry address", registry.address);
  

};

export default func;

func.tags = ["TestToken", "Registry", "feeReceiver",];


// Mainnet registry addresses

// 0x43E55608892989c43366CCd07753ce49e0c17688
// 0x70EF9503DB13ea94f001476B6d8491784348F8aF
// Tokens
// [
//   '0x409e23a02AC0e8eEa44B504B01fc6f672f624Fca',
//   '0x7885F497c2b2b5096b92b70a31aEEb74070A4e69'
// ]