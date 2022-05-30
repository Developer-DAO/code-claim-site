import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer, treasury } = await getNamedAccounts();

  const vestingStart = Math.floor(Date.now() / 1000);

  const codeContract = await ethers.getContract('CODE');
  const connectContract = await codeContract.connect(await ethers.getSigner(treasury));

  const dd = await deploy('Vesting', {
    from: deployer,
    log: true,
    args: [codeContract.address, vestingStart],
  });

  // only 50% will go vesting
  await connectContract.transfer(dd.address, ethers.utils.parseUnits((690_000 / 2).toString(), 18));

  const vestingContract = await ethers.getContract('Vesting');
  const connectVestingContract = await vestingContract.connect(await ethers.getSigner(deployer));

  await connectVestingContract.transferOwnership(treasury);

  console.log('vestingAmount:', (await codeContract.balanceOf(dd.address)).toString());

  console.log('Vesting contract deployer:', deployer);
  console.log('Vesting contract deployed to:', dd.address);
};

export default main;
main.dependencies = ['CODE'];
main.tags = ['Vesting'];
