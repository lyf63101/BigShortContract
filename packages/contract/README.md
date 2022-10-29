# local deploy

npx hardhat node --fork https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161

npx hardhat run --network localhost scripts\deploy.js

metamask add rpc localhost http://127.0.0.1:8545/



# test
npx hardhat test