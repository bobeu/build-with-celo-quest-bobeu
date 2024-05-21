import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, getNetworkName} = deployments;
	const {deployer, cUSD} = await getNamedAccounts();

  const networkName = getNetworkName();
  console.log("Network Name", networkName); 

  const testToken = await deploy("TestToken", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log("TestToken address", testToken.address);
  
  const registry = await deploy("Registry", {
    from: deployer,
    args: [[testToken.address], cUSD],
    log: true,
  });
  console.log("Registry address", registry.address);
  

};

export default func;

func.tags = ["TestToken", "Registry"];






// import Web3 from "web3";
// import { newKitFromWeb3 } from "@celo/contractkit";

// const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
// const kit = newKitFromWeb3(web3);


// import Web3 from "web3";
// import { newKitFromWeb3 } from "@celo/contractkit";

// // define localUrl and port with the ones for your node

// const web3 = new Web3(`${localUrl}:${port}`);
// const kit = newKitFromWeb3(web3);


// import Web3 from "web3";
// import { newKitFromWeb3 } from "@celo/contractkit";

// const web3Instance: Web3 = new Web3(
//   new Web3.providers.IpcProvider("/Users/myuser/Library/CeloNode/geth.ipc", net)
// );

// const kit = newKitFromWeb3(web3Instance);