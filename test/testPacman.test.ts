import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';
const util = require('../scripts/util');
const { parseEther } = ethers.utils;
const colors = require('colors');

import { expect } from 'chai';
import {
    PacManGame
} from '../typechain';
import { formatEther } from 'ethers/lib/utils';

//available functions
describe("Token contract", async () => {


    let pacman: PacManGame;
    let deployer: SignerWithAddress;
    let bob: SignerWithAddress;
    let alice: SignerWithAddress;
    let jonh: SignerWithAddress;
    let manager: SignerWithAddress;
    let taxReceiver: SignerWithAddress;

    it("1. Get Signer", async () => {
        const signers = await ethers.getSigners();

        deployer = signers[0];
        bob = signers[1];
        alice = signers[2];
        jonh = signers[3];
        manager = signers[4];
        taxReceiver = signers[5];

        console.log(`${colors.cyan('Deployer Address')}: ${colors.yellow(deployer?.address)}`)
        console.log(`${colors.cyan('Bob Address')}: ${colors.yellow(bob?.address)}`)
        console.log(`${colors.cyan('Alice Address')}: ${colors.yellow(alice?.address)}`)
        console.log(`${colors.cyan('Jonh Address')}: ${colors.yellow(jonh?.address)}`)
        console.log(`${colors.cyan('Manager Address')}: ${colors.yellow(manager?.address)}`)
        console.log(`${colors.cyan('Tax Receiver Address')}: ${colors.yellow(taxReceiver?.address)}`)
    });

    it("2. Deploy Contract", async () => {

        const iterableMappingFactory = await ethers.getContractFactory("IterableMapping")
        const IterableMappingDeployed = await iterableMappingFactory.deploy()
        await IterableMappingDeployed.deployed()

        const pacmanFactory = await ethers.getContractFactory("PacManGame", {
            libraries: {
                IterableMapping: IterableMappingDeployed.address
            },
        });
        pacman = await pacmanFactory.deploy(taxReceiver.address, manager.address);
        await pacman.deployed();

        expect(pacman.address).to.properAddress;
    });


    it("3. Play", async () => {

        const playPrice = await pacman.playPrice()
        expect(playPrice).to.equal(parseEther('0.001'))

        await pacman.connect(deployer).play({ value: playPrice })
        await pacman.connect(bob).play({ value: playPrice })
        await pacman.connect(alice).play({ value: playPrice })
        await pacman.connect(jonh).play({ value: playPrice })

        const contractBalance = await ethers.provider.getBalance(pacman.address)
        expect(formatEther(contractBalance)).to.equal("0.0028")

        const taxReceiverBalance = await ethers.provider.getBalance(taxReceiver.address)
        expect(formatEther(taxReceiverBalance)).to.equal("10000.0012")
    })

    it("4. Set Scores", async () => {
        await pacman.connect(manager).setPlayerScore(bob.address, 10)
        await pacman.connect(manager).setPlayerScore(alice.address, 40)
        await pacman.connect(manager).setPlayerScore(jonh.address, 30)
        await pacman.connect(manager).setPlayerScore(jonh.address, 20)
    })


    it("4. Get Ranking", async () => {
        const ranking = await pacman.getRanking()
        expect(ranking.length).to.equal(4)
    })

    it("5. Get top three players", async () => {
        const topThree = await pacman.getTopThreePlayers()
        expect(topThree.length).to.equal(3)

        console.log({
            topThree
        })

    })

    it("7. End game", async () => {
        await pacman.connect(deployer).endGame()
    })

});

