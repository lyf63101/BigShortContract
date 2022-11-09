const {changeUSDTBalance} = require("./changeUSDTBalance");

const hre = require("hardhat");


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

async function main() {
    const accounts = await ethers.getSigners();
    const account = accounts[0];
    await changeUSDTBalance(accounts[0].address, ethers.utils.parseUnits("1500", 6));
    const USDTContract = await new ethers.Contract(USDTAddress, abi, account);
    const balance = await USDTContract.balanceOf(account.address);
    console.log("balance: of account ", account.address, "is : ", balance.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
