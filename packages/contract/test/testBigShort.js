const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const {changeUSDTBalance} = require("./changeUSDTBalance");

describe("BigShort", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  before(async function () {
    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            //blockNumber: <BLOCK_NUMBER>,
          },
        },
      ],
    });
  });


  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const deadline  = (await time.latest()) + ONE_YEAR_IN_SECS;
    const predictionPrice = 1500 * 1e18;
    const higherOrEqual = true;
    const amount = 1e7; // 10 USDT

    // Contracts are deployed using the first signer/account by default
    const [starter, counter_party] = await ethers.getSigners();

    changeUSDTBalance(starter, 1e8);
    changeUSDTBalance(counter_party, 1e8);

    const FactoryContract = await ethers.getContractFactory("BigShortAlphaFactory");
    const Contract = await ethers.getContractFactory("BigShortAlpha");
    const factory_contract = await FactoryContract.deploy();
    const contract = factory_contract.createNewBetContract(counter_party, predictionPrice, deadline, higherOrEqual, amount)
    //const contract = await Contract.deploy(unlockTime, predictionPrice,  { value: lockedAmount });
    return { contract, starter, counter_party, predictionPrice, deadline, higherOrEqual, amount };
  }

  describe("Deployment", function () {
    it("Should set the right deadline", async function () {
      const { contract, deadline } = await loadFixture(deployOneYearLockFixture);

      expect(await contract.deadline() ).to.equal(deadline);
    });

    it("Should set the right owner", async function () {
      const { contract, starter,counter_party  } = await loadFixture(deployOneYearLockFixture);

      expect(await contract.starter() ).to.equal(starter.address);
    });

    // it("Should receive and store the funds to lock", async function () {
    //   const { contract, lockedAmount } = await loadFixture(
    //     deployOneYearLockFixture
    //   );

    //   expect(await ethers.provider.getBalance(contract.address)).to.equal(
    //     lockedAmount
    //   );
    // });

    // it("Should fail if the unlockTime is not in the future", async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest();
    //   const Contract = await ethers.getContractFactory("BigShortAlpha");
    //   const predictionPrice = 1500;
    //   await expect(Contract.deploy(latestTime, predictionPrice, { value: 1 })).to.be.revertedWith(
    //     "Unlock time should be in the future"
    //   );
    // });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
    //   it("Should revert with the right error if called too soon", async function () {
    //     const { contract } = await loadFixture(deployOneYearLockFixture);

    //     await expect(contract.withdraw()).to.be.revertedWith(
    //       "You can't withdraw yet"
    //     );
    //   });

    //   it("Should revert with the right error if called from another account", async function () {
    //     const { contract, unlockTime, otherAccount } = await loadFixture(
    //       deployOneYearLockFixture
    //     );

    //     // We can increase the time in Hardhat Network
    //     await time.increaseTo(unlockTime);

    //     // We use lock.connect() to send a transaction from another account
    //     await expect(contract.connect(otherAccount).withdraw()).to.be.revertedWith(
    //       "You aren't the owner"
    //     );
    //   });

    //   it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
    //     const { contract, unlockTime } = await loadFixture(
    //       deployOneYearLockFixture
    //     );
    //     console.log(unlockTime);
    //     console.log(await contract.getLatestPrice());
    //     // Transactions are sent using the first signer by default
    //     await time.increaseTo(unlockTime);

    //     await expect(contract.withdraw()).not.to.be.reverted;
    //   });
    });

    describe("Events", function () {
      // it("Should emit an event on withdrawals", async function () {
      //   const { contract, unlockTime, lockedAmount } = await loadFixture(
      //     deployOneYearLockFixture
      //   );

      //   await time.increaseTo(unlockTime);

      //   await expect(contract.withdraw())
      //     .to.emit(contract, "Withdrawal")
      //     .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
      // });
    });

    describe("Transfers", function () {
      // it("Should transfer the funds to the owner", async function () {
      //   const { contract, unlockTime, lockedAmount, owner } = await loadFixture(
      //     deployOneYearLockFixture
      //   );

      //   await time.increaseTo(unlockTime);

      //   await expect(contract.withdraw()).to.changeEtherBalances(
      //     [owner, contract],
      //     [lockedAmount, -lockedAmount]
      //   );
      // });
    });
  });
});
