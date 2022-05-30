import { BigNumber } from 'ethers';
import { ethers, getNamedAccounts } from 'hardhat';
import { Vesting } from '../../next-app/src/typechain';

const TOKEN_DECIMALS = 18;

async function main() {
    const { treasury } = await getNamedAccounts();
    const vestingContract = <Vesting>await ethers.getContract('Vesting', treasury);

    // TODO: fill out actual addresses and shares for founding team and advisors
    const foundingAddresses: string[] = []
    const foundingShares: BigNumber[] = []

    const advisorAddresses: string[] = []
    const advisorShares: BigNumber[] = []

    // https://forum.developerdao.com/t/draft-ratify-the-early-contributor-allocations-of-code/2065#vesting-of-early-contributor-allocations-5
    const earlyContribAddresses = [
        "0xc8f20c9105410069c11eded2c05e1b2608103b25",
        "0x186ea56f0a40c5593a697b3e804968b8c5920ff3",
        "0x9934f8ccfdf5e008ac8c07bf00582a833cd33b99",
        "0x57dfa643313140b667df0811d7c70f67aa766038",
        "0x95e17e827df0b113d11d48ee1771ff134f770da9",
        "0x64ae4fd3e9906ee4a0189e3a393d19b3e35cdb67",
        "0x0ed6cec17f860fb54e21d154b49daefd9ca04106",
        "0xec57157adeb11f9822039a48a97b365bc22cbc49"
    ];

    const earlyContribShares = [
        ethers.utils.parseUnits((20_000).toString(), TOKEN_DECIMALS),
        ethers.utils.parseUnits((20_000).toString(), TOKEN_DECIMALS),
        ethers.utils.parseUnits((20_000).toString(), TOKEN_DECIMALS),
        ethers.utils.parseUnits((15879.84).toString(), TOKEN_DECIMALS),
        ethers.utils.parseUnits((15097.22).toString(), TOKEN_DECIMALS),
        ethers.utils.parseUnits((14555.42).toString(), TOKEN_DECIMALS),
        ethers.utils.parseUnits((9558.73).toString(), TOKEN_DECIMALS),
        ethers.utils.parseUnits((2575.4).toString(), TOKEN_DECIMALS),
    ];

    const tx = await vestingContract.addOrUpdatePayees(
        (foundingAddresses.concat(advisorAddresses)).concat(earlyContribAddresses),
        (foundingShares.concat(advisorShares)).concat(earlyContribShares));
    await tx.wait();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

