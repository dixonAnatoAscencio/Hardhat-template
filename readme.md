Deploy
npx hardhat run scripts/deployPacmanGame.ts --network mumbai

Run tests
1 Open console and Run local node
npx hardhat node --fork https://polygon-mumbai.g.alchemy.com/v2/demo

2. Open other console and Run tests
npx hardhat test test/testPacman.test.ts --network localhost

Verify contract with arguments
npx hardhat verify 0x4C2Db5BE630FC1E1F234D0ea30708607bBD23500  --constructor-args arguments.js --network goerli

Verify contract with arguments and libraries
npx hardhat verify 0x4C2Db5BE630FC1E1F234D0ea30708607bBD23500  --constructor-args arguments.js --libraries libraries.js  --network goerli