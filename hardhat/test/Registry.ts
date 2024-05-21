import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
// import Web3 from "web3";
// import { newKitFromWeb3 } from "@celo/contractkit";

// const isTestnet = true;
// const web3 = new Web3(isTestnet? "https://alfajores-forno.celo-testnet.org" : "https://forno.celo.org");
// const contractkit = newKitFromWeb3(web3);
// const cUSD = (await contractkit.contracts.getStableToken()).balanceOf()
// const CUSD_TESTNET = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployCoinPickerFixture() {
    // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;
    const QUANTITY = 40_000;

    // const lockedAmount = ONE_GWEI;
    // const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, seller] = await ethers.getSigners();

    const TestCUSD = await ethers.getContractFactory("TestCUSD");
    const cusd = await TestCUSD.deploy();

    const FeeReceiver = await ethers.getContractFactory("FeeReceiver");
    const feeReceiver = await FeeReceiver.deploy();

    const TestToken = await ethers.getContractFactory("TestToken");
    const token = await TestToken.deploy();
    await token.mint(seller.address);
    await token.mint(owner.address);

    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy([token.address], cusd.address, feeReceiver.address);

    return { registry, token, owner, seller, feeReceiver, cusd, QUANTITY, ONE_GWEI };
  }

  describe("Deployment", function () {
    it("Registry should have the correct cUSD address", async function () {
      const { registry, cusd } = await loadFixture(deployCoinPickerFixture);

      expect(await registry.cUSD()).to.equal(cusd.address);
    });

    it("Registry should have the correct feeReceiver address", async function () {
      const { registry, feeReceiver } = await loadFixture(deployCoinPickerFixture);

      expect(await registry.feeTo()).to.equal(feeReceiver.address);
    });

    it("Should create xWallet successfully", async function () {
      const { registry, seller } = await loadFixture(deployCoinPickerFixture);
      await registry.connect(seller).createXWallet();
      await expect(registry.connect(seller).createXWallet()).to.be.revertedWith("XWallet exist");
    });

    it("Should confirm that it supports Test asset", async function () {
      const { registry, token } = await loadFixture(deployCoinPickerFixture);
      const data = await registry.getData();
      const sa = data._supportedAssets[0];
      expect(sa.isVerified).to.be.true;
      expect(sa.asset).to.be.eq(token.address, "Asset mismatch");
      expect(sa.assetId).to.be.equal(0, `AssetId is ${sa.assetId} against 0`);
    });

    it("Seller should add item to the storeFront", async function () {
      const { registry, seller, QUANTITY, token, ONE_GWEI } = await loadFixture(deployCoinPickerFixture);
      const ids = 0;
      await token.connect(seller).approve(registry.address, QUANTITY);
      await registry.connect(seller).addItemToStoreFront(ids, ONE_GWEI);
      const data = await registry.getData();
      const store = data._stores[ids];
      expect(store.priceLimit.toNumber()).to.be.equal(ONE_GWEI);
      expect(store.asset).to.be.equal(token.address);
      expect(store.metadata.name).to.be.equal(await token.name());
      expect(store.metadata.symbol).to.be.equal(await token.symbol());
      expect(store.metadata.decimals).to.be.equal(await token.decimals());
    });

    it("Buyer should buy item successfully", async function () {
      const { registry, seller, token, cusd, owner : buyer, ONE_GWEI, QUANTITY } = await loadFixture(deployCoinPickerFixture);
      const ids = 0;
      const offerPrice = 1_500_000_000
      const amount = 20000;
      await registry.connect(buyer).createXWallet();
      const initData = await registry.getData();
      const wallet = initData._xWallets[0].xWallet;
      await cusd.connect(buyer).mint(wallet);
      await token.connect(seller).approve(registry.address, QUANTITY);
      await registry.connect(seller).addItemToStoreFront(ids, ONE_GWEI);
      await registry.connect(buyer).buy(ids, amount, offerPrice);
      const data = await registry.getData();
      const store = data._stores[ids];
      expect(store.info.quantity).to.be.equal(QUANTITY - amount);

    })
  });

    describe("Events", function () {
      // it("Should emit an event on withdrawals", async function () {
      //   const { lock, unlockTime, lockedAmount } = await loadFixture(
      //     deployCoinPickerFixture
      //   );

      //   await time.increaseTo(unlockTime);

      //   await expect(lock.withdraw())
      //     .to.emit(lock, "Withdrawal")
      //     .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
      // });
    });

    // describe("Transfers", function () {
    //   it("Should transfer the funds to the owner", async function () {
    //     const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
    //       deployCoinPickerFixture
    //     );

    //     await time.increaseTo(unlockTime);

    //     await expect(lock.withdraw()).to.changeEtherBalances(
    //       [owner, lock],
    //       [lockedAmount, -lockedAmount]
    //     );
    //   });
    // });
  // });
});
