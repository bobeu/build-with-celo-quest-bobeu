Coinpicker is an ecommerce platform to shop for cryptocurrencies. Buyers can shop for different coins or tokens of their choices, add them to the cart and check out anytime.

Coinpicker smart contract has the capacity to interact with other contracts on other chains.
The architecture allows token owners to deposit their token into the token contact vault, set a price
range and allow anyone to speculate and purchase then via the coinpicker interface. It blends 
the features of ecommerce with cryptocurrency to bring a new parandigm of cryptocurrency exchange. Coinpicker is a storefront for different kinds of ERC20 and ERC721 tokens.

# User story

- Sellers

1. Seller visits the coinpicker [interface](https://somelink.com)
2. Seller deposit `n` amount of token into the Coinpicker storefont contract.
3. Seller sets price range (`f`: min -> g: max prices).
4. Seller executes onchain posting or orders. 

- Buyers

1. Buyer visits the storefront.
2. Buyer picks token or coin of choice and add then to cart.
3. Buyer checks out.

# Contract flow

1. Admin preset and verify approved token/coin on the smart contract. Smart contract addresses are needed to verify token metadata onchain. Due dilligence is expected to be carried out by the project admin or dedicated subject to ensure contracts being added do not contain phishy code.

2. Tokens/coins being added to the storefront must be a verified one hence Sellers selects from the list of verified token.

3. Sellers must give approvals to the storefront contract to spend stipulated amount from their balances in the destinated token contract.

4. Storefront contract retrieves the token and add to the registry with the necessary information.

5. Buyers can query the registry for available token for purchase.
6. When buyers shop, each selected item is treated as a batch/link-based transaction configured using the PEANUT protocol sdk.

7. On checking out, tokens are forwarded to the buyer subsequent to sending equivalent amount of cUSD to the protocol.

8. The balance of such asset is updated from the registry.

### Miscellaneous

- Sellers can cancel display request anytime. i.e withdraw token from the registry. 
- An amount as fee is charged on the Seller in `cUSD` for using the storefront.
- Buyer also pays a tiny amount in cUSD for using the platform.
- For tokens/coins on other chains, we use the crosschain registry with Wormhole crosschain messaging to handle request on other chains.

For this hackathon, we're using registry on Celo blockchain only hence only Celo-based token are supported.