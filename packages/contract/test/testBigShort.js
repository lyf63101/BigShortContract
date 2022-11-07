const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const {changeUSDTBalance} = require("./changeUSDTBalance");

const abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint amount) returns (bool)",
  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)"
];
const USDTAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F".toLowerCase(); // usdc testnet

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
    //const predictionPrice = 1500 * 1e18; 
    const predictionPrice = ethers.utils.parseUnits("1500", 18);
    const higherOrEqual = true;
    const amount = 1e7; // 10 USDT

    // Contracts are deployed using the first signer/account by default
    const [starter, counter_party] = await ethers.getSigners();

    const FactoryContract = await ethers.getContractFactory("BigShortAlphaFactory");
    const Contract = await ethers.getContractFactory("BigShortAlpha");
    const factory_contract = await FactoryContract.deploy();
    const create_contract_tx = await factory_contract.createNewBetContract(counter_party.address, predictionPrice, deadline, higherOrEqual, amount);
    const contract_address = await factory_contract.resolveBetContractByOwnner(starter.address);
    //const contract = await Contract.deploy(unlockTime, predictionPrice,  { value: lockedAmount });
    const contract = await Contract.attach(
      contract_address
    );
    //const contract = new ethers.Contract(contract_adress, abi, wallet);
    console.log(contract_address);
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

  describe("Pay", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called cancel too soon", async function () {
        const { contract } = await loadFixture(deployOneYearLockFixture);

        await expect(contract.cancel()).to.be.revertedWith(
          "could only cancel when counter not paied"
        );
      });

      it("Should revert with the right error if called claim too soon", async function () {
        const { contract } = await loadFixture(deployOneYearLockFixture);

        await expect(contract.claimRewards()).to.be.revertedWith(
          "You can't claim yet"
        );
      });

      it("Should pay success", async function () {
        const { contract,starter, counter_party, amount } = await loadFixture(deployOneYearLockFixture);
        await changeUSDTBalance(starter.address, 1e8);
        // await changeUSDTBalance(counter_party.address, 1e8);
        const USDTContract = await new ethers.Contract(USDTAddress, abi, starter);
        await USDTContract.transfer(counter_party.address, 5*1e7);
        const balance = await USDTContract.balanceOf(starter.address);
        const balance2 = await USDTContract.balanceOf(counter_party.address);
        console.log("balance: of starter ", balance.toString());
        console.log("balance of counter_party: ", balance2.toString());
        console.log("amount: ", amount);
        await USDTContract.approve(contract.address, amount);
        await USDTContract.connect(counter_party).approve(contract.address, amount);
        const tx = await contract.starterPay();
        console.log(tx);
        await expect(tx).not.to.be.reverted;
        const tx2 = await contract.connect(counter_party).counterPartyPay();
        await expect(tx2).not.to.be.reverted;
        expect(await contract.starter_paied()).to.equal(true);
        expect(await contract.counter_party_paied()).to.equal(true);
      });

      it("Should revert if not arrive cancel time", async function () {
        const { contract,starter, counter_party, amount } = await loadFixture(deployOneYearLockFixture);
        await changeUSDTBalance(starter.address, 1e8);
        // await changeUSDTBalance(counter_party.address, 1e8);
        const USDTContract = await new ethers.Contract(USDTAddress, abi, starter);
        const balance = await USDTContract.balanceOf(starter.address);
        console.log("balance: of starter ", balance.toString());
        console.log("amount: ", amount);
        await USDTContract.approve(contract.address, amount);
        const tx = await contract.starterPay();
        await expect(tx).not.to.be.reverted;
        await expect(contract.cancel()).to.be.revertedWith("could only cancel after 7 days");
      });

      it("Should success if arrive cancel time", async function () {
        const { contract,starter, counter_party, deadline, amount } = await loadFixture(deployOneYearLockFixture);
        await changeUSDTBalance(starter.address, 1e8);
        // await changeUSDTBalance(counter_party.address, 1e8);
        const USDTContract = await new ethers.Contract(USDTAddress, abi, starter);
        const balance = await USDTContract.balanceOf(starter.address);
        console.log("balance: of starter ", balance.toString());
        console.log("amount: ", amount);
        await USDTContract.approve(contract.address, amount);
        const tx = await contract.starterPay();
        await expect(tx).not.to.be.reverted;
        await time.increaseTo(deadline);
        await expect(contract.cancel()).not.to.be.reverted;
      });
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

    describe("Claim", function () {
      it("Should revert if not arrive deadline", async function () {
        const { contract,starter, counter_party, amount } = await loadFixture(deployOneYearLockFixture);
        await changeUSDTBalance(starter.address, 1e8);
        // await changeUSDTBalance(counter_party.address, 1e8);
        const USDTContract = await new ethers.Contract(USDTAddress, abi, starter);
        const balance = await USDTContract.balanceOf(starter.address);
        await USDTContract.approve(contract.address, amount);
        const tx = await contract.starterPay();
        await expect(tx).not.to.be.reverted;
        await expect(contract.claimRewards()).to.be.revertedWith("You can't claim yet");
      });

      it("Should revert if not both paid", async function () {
        const { contract,starter, counter_party,deadline, amount } = await loadFixture(deployOneYearLockFixture);
        await changeUSDTBalance(starter.address, 1e8);
        // await changeUSDTBalance(counter_party.address, 1e8);
        const USDTContract = await new ethers.Contract(USDTAddress, abi, starter);
        const balance = await USDTContract.balanceOf(starter.address);
        await USDTContract.approve(contract.address, amount);
        const tx = await contract.starterPay();
        await expect(tx).not.to.be.reverted;
        await time.increaseTo(deadline);
        await expect(contract.claimRewards()).to.be.revertedWith("only can claim when both paied");
      });

      it("Should claim success", async function () {
        const { contract,starter, counter_party, amount,deadline, predictionPrice, higherOrEqual } = await loadFixture(deployOneYearLockFixture);
        await changeUSDTBalance(starter.address, 1e8);
        // await changeUSDTBalance(counter_party.address, 1e8);
        const USDTContract = await new ethers.Contract(USDTAddress, abi, starter);
        await USDTContract.transfer(counter_party.address, 5*1e7);
        await USDTContract.approve(contract.address, amount);
        await USDTContract.connect(counter_party).approve(contract.address, amount);
        const tx = await contract.starterPay();
        await expect(tx).not.to.be.reverted;
        const tx2 = await contract.connect(counter_party).counterPartyPay();
        await expect(tx2).not.to.be.reverted;
        expect(await contract.starter_paied()).to.equal(true);
        expect(await contract.counter_party_paied()).to.equal(true);
        await time.increaseTo(deadline);
        const price = await contract.getLatestPrice();
        console.log("price: ", price.toString(), "predictionPrice: ", predictionPrice.toString());
        if (price < predictionPrice) {
          if (higherOrEqual) {
            expect(await contract.claimRewards() ).to.be.reverted;
            expect(await contract.connect(counter_party).claimRewards() ).to.not.be.reverted;
          } else {
            expect(await contract.connect(counter_party).claimRewards() ).to.be.reverted;
            expect(await contract.claimRewards() ).to.not.be.reverted;
          }
        } else {
          if (higherOrEqual) {
            expect(await contract.claimRewards() ).to.not.be.reverted;
          } else {
            expect(await contract.connect(counter_party).claimRewards() ).to.not.be.reverted;
          }
        }
        const balance = await USDTContract.balanceOf(starter.address);
        const balance2 = await USDTContract.balanceOf(counter_party.address);
        console.log("starter balance: ", balance.toString(), "counter_party balance: ", balance2.toString());
      });


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
