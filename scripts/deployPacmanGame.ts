
import { ethers } from 'hardhat'
import { formatEther, parseEther } from 'ethers/lib/utils';
const colors = require('colors/safe');
import { sleep, updateABI, verify } from './util';

async function main() {
    const [deployer] = await ethers.getSigners();
    if (deployer === undefined) throw new Error("Deployer is undefined.");
    console.log(
        colors.cyan("Deployer Address: ") + colors.yellow(deployer.address)
    );
    console.log(
        colors.cyan("Account balance: ") +
        colors.yellow(formatEther(await deployer.getBalance()))
    );
    console.log();

    const gasLimit = ethers.BigNumber.from(200000)
    console.log(gasLimit)



    const iterableMappingFactory = await ethers.getContractFactory("IterableMapping")
    const IterableMappingDeployed = await iterableMappingFactory.deploy()
    await IterableMappingDeployed.deployed()

    const pacmanFactory = await ethers.getContractFactory("PacManGame", {
        libraries: {
            IterableMapping: IterableMappingDeployed.address
        },
    });
    const pacman = await pacmanFactory.deploy("0xEE6DBA6FC60D58F39BE9d3B4E5298CA1aCbEe94f", "0xc672864b014BCAf8999C09E0D89090348376aA04")
    await pacman.deployed();
    console.log("PacManGame deployed to:", pacman.address);

    await sleep("30")

    await updateABI("PacManGame");
    await verify(pacman.address, "PacManGame", ["0xEE6DBA6FC60D58F39BE9d3B4E5298CA1aCbEe94f", "0xc672864b014BCAf8999C09E0D89090348376aA04"])

    


}

main()
    .then(async (r: any) => {
        console.log("");
        return r;
    })
    .catch(error => {
        console.log(colors.red("ERROR :("));
        console.log(colors.red(error));
        return undefined;
    })


