// https://mixbytes.io/blog/modify-ethereum-storage-hardhats-mainnet-fork
function getSlot(userAddress, mappingSlot) {
  return ethers.utils.solidityKeccak256(
      ["uint256", "uint256"],
      [userAddress, mappingSlot]
  )
}

async function checkSlot(erc20, mappingSlot) {
  const contractAddress = erc20.address
  const userAddress = ethers.constants.AddressZero

  // the slot must be a hex string stripped of leading zeros! no padding!
  // https://ethereum.stackexchange.com/questions/129645/not-able-to-set-storage-slot-on-hardhat-network
  const balanceSlot = getSlot(userAddress, mappingSlot)

  // storage value must be a 32 bytes long padded with leading zeros hex string
  const value = 0xDEADBEEF
  const storageValue = ethers.utils.hexlify(ethers.utils.zeroPad(value, 32))

  await ethers.provider.send(
      "hardhat_setStorageAt",
      [
          contractAddress,
          balanceSlot,
          storageValue
      ]
  )
  return await erc20.balanceOf(userAddress) == value
}

async function findBalanceSlot(erc20) {
  const snapshot = await network.provider.send("evm_snapshot")
  for (let slotNumber = 0; slotNumber < 100; slotNumber++) {
      try {
          if (await checkSlot(erc20, slotNumber)) {
              await ethers.provider.send("evm_revert", [snapshot])
              return slotNumber
          }
      } catch { }
      await ethers.provider.send("evm_revert", [snapshot])
  }
}

async function changeUSDTBalance(address, amount) {
    const usdc = await ethers.getContractAt("IERC20", usdcAddress)
    
    // automatically find mapping slot
    const mappingSlot = await findBalanceSlot(usdc)
    console.log("Found USDC.balanceOf slot: ", mappingSlot)

    // calculate balanceOf[signerAddress] slot
    const signerBalanceSlot = getSlot(address, mappingSlot)
    
    // set it to the value
    const value = amount
    await ethers.provider.send(
        "hardhat_setStorageAt",
        [
            usdc.address,
            signerBalanceSlot,
            ethers.utils.hexlify(ethers.utils.zeroPad(value, 32))
        ]
    )
}
module.exports =  {changeUSDTBalance};
// check that the user balance is equal to the expected value
// expect(await usdc.balanceOf(signerAddress)).to.be.eq(value)