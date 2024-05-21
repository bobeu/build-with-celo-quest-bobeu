import { config as dotConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

dotConfig();

const PRIVATE_KEY = String(process.env.PRIVATE_KEY);

const config: HardhatUserConfig = {
    networks: {
        alfajores: {
            url: "https://alfajores-forno.celo-testnet.org",
            accounts: [PRIVATE_KEY],
        },
        celo: {
            url: "https://forno.celo.org",
            accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: {
            alfajores: String(process.env.CELOSCAN_API_KEY),
            celo: String(process.env.CELOSCAN_API_KEY),
        },
        customChains: [
            {
                network: "alfajores",
                chainId: 44787,
                urls: {
                    apiURL: "https://api-alfajores.celoscan.io/api",
                    browserURL: "https://alfajores.celoscan.io",
                },
            },
            {
                network: "celo",
                chainId: 42220,
                urls: {
                    apiURL: "https://api.celoscan.io/api",
                    browserURL: "https://celoscan.io/",
                },
            },
        ],
    },

    namedAccounts: {
        deployer: {
          default: 0,
          44787: `privatekey://${PRIVATE_KEY}`,
          42220: `privatekey://${PRIVATE_KEY}`,
        },
        cUSD: {
            default: 1,
            44787: "",
            42220: ""
        }
      },
    
    solidity: {
    version: "0.8.20",
    settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
        enabled: true,
        runs: 200,
        },
        evmVersion: "byzantium"
        }
    },
};

export default config;