import { expect } from './chai-setup';
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from 'hardhat';
import { Vesting, CODE } from '../../next-app/src/typechain';
import { setupUsers } from './utils';

const TOKEN_DECIMALS = 18;

const setup = deployments.createFixture(async () => {
  await deployments.fixture(['Vesting']);

  const mockERC20Cf = await ethers.getContractFactory('MockERC20');
  const mockERC20 = await mockERC20Cf.deploy();
  await mockERC20.deployed();

  const mockERC721Cf = await ethers.getContractFactory('MockERC721');
  const mockERC721 = await mockERC721Cf.deploy();
  await mockERC721.deployed();

  const unnamedAccounts = await getUnnamedAccounts();
  const payees = [unnamedAccounts[1], unnamedAccounts[2], unnamedAccounts[3]];
  // shares should sum up to 690_000
  const shares = [
    ethers.utils.parseUnits((150_000).toString(), TOKEN_DECIMALS),
    ethers.utils.parseUnits((150_000).toString(), TOKEN_DECIMALS),
    ethers.utils.parseUnits((45_000).toString(), TOKEN_DECIMALS),
  ];

  const CODE = <CODE>await ethers.getContract('CODE');
  const Vesting = <Vesting>await ethers.getContract('Vesting');
  const users = await setupUsers(unnamedAccounts, { Vesting });

  const { treasury } = await getNamedAccounts();
  const treasuryOwnedVesting = await Vesting.connect(await ethers.getSigner(treasury));

  await treasuryOwnedVesting.addOrUpdatePayees(payees, shares);

  await mockERC721.mintTo(treasury);
  const treasuryOwnedNFT = await mockERC721.connect(await ethers.getSigner(treasury));
  await treasuryOwnedNFT.transferFrom(treasury, Vesting.address, 1);

  return {
    CODE,
    Vesting,
    mockERC20,
    mockERC721,
    treasuryOwnedVesting,
    users,
  };
});

describe('Vesting', function () {
  it('Deployment should assign vesting supply of tokens correctly', async function () {
    const { CODE, Vesting } = await setup();
    const vestingBalance = await CODE.balanceOf(Vesting.address);
    expect(vestingBalance).to.equal(ethers.utils.parseUnits((690_000 / 2).toString(), TOKEN_DECIMALS));
  });

  it('Deployment should assign treasury as the owner of vesting contract', async function () {
    const { Vesting } = await setup();
    const { treasury } = await getNamedAccounts();
    const owner = await Vesting.owner();
    expect(treasury).to.equal(owner);
  });

  it('update payee shares', async function () {
    const { treasuryOwnedVesting } = await setup();
    const unnamedAccounts = await getUnnamedAccounts();
    const account1 = unnamedAccounts[1];
    const oldShares = ethers.utils.parseUnits((150_000).toString(), TOKEN_DECIMALS);
    const newShares = ethers.utils.parseUnits((300_000).toString(), TOKEN_DECIMALS);
    expect(await treasuryOwnedVesting.shares(account1)).to.equal(oldShares);
    await treasuryOwnedVesting.addOrUpdatePayee(account1, newShares);
    expect(await treasuryOwnedVesting.shares(account1)).to.equal(newShares);
  });

  it('should calculate the right epoch', async function () {
    const { Vesting } = await setup();
    // no releasable assets at exactly the same time after vesting contract deployed
    expect(await Vesting.epoch(0 * 24 * 60 * 60)).to.equal(0);
    expect(await Vesting.epoch(29 * 24 * 60 * 60)).to.equal(0);
    expect(await Vesting.epoch(35 * 24 * 60 * 60)).to.equal(1);
    expect(await Vesting.epoch(59 * 24 * 60 * 60)).to.equal(1);
    expect(await Vesting.epoch(60 * 24 * 60 * 60)).to.equal(2);
  });

  it('no releasable assets within the first 30 days', async function () {
    const { users } = await setup();
    const tenDayAfter = 10 * 24 * 60 * 60;
    await ethers.provider.send('evm_increaseTime', [tenDayAfter]);
    // vesting tokens will only be released every month
    await expect(users[1].Vesting.release()).to.be.revertedWith('AccountHasNoDuePayment()');
  });

  it('non payee got no vesting', async function () {
    const { users } = await setup();
    await expect(users[0].Vesting.release()).to.be.revertedWith('AccountHasNoShare()');
  });

  it('release part of shares if vesting duration not ends', async function () {
    const { CODE, users } = await setup();

    const twoMonthAfter = 2 * 30 * 24 * 60 * 60;
    await ethers.provider.send('evm_increaseTime', [twoMonthAfter]);

    await users[1].Vesting.release();
    expect(await CODE.balanceOf(users[1].address)).to.equal(
      ethers.utils.parseUnits(((150_000 * 2) / 24).toString(), TOKEN_DECIMALS)
    );

    expect(await users[1].Vesting.released(users[1].address)).to.equal(
      ethers.utils.parseUnits(((150_000 * 2) / 24).toString(), TOKEN_DECIMALS)
    );

    const anotherEightMonthAndTenDayAfter = 8 * 30 * 24 * 60 * 60 + 10 * 24 * 60 * 60;
    await ethers.provider.send('evm_increaseTime', [anotherEightMonthAndTenDayAfter]);

    await users[1].Vesting.release();
    expect(await CODE.balanceOf(users[1].address)).to.equal(
      ethers.utils.parseUnits(((150_000 * 10) / 24).toString(), TOKEN_DECIMALS)
    );
    expect(await users[1].Vesting.released(users[1].address)).to.equal(
      ethers.utils.parseUnits(((150_000 * 10) / 24).toString(), TOKEN_DECIMALS)
    );
  });

  it('release all shares if vesting duration ends', async function () {
    const { CODE, users } = await setup();

    const oneYearsAfter = 365 * 24 * 60 * 60;
    await ethers.provider.send('evm_increaseTime', [oneYearsAfter]);

    await users[1].Vesting.release();
    expect(await CODE.balanceOf(users[1].address)).to.equal(
      ethers.utils.parseUnits(((150_000 * 12) / 24).toString(), TOKEN_DECIMALS)
    );
    expect(await users[1].Vesting.released(users[1].address)).to.equal(
      ethers.utils.parseUnits(((150_000 * 12) / 24).toString(), TOKEN_DECIMALS)
    );

    const anotherYearsAfter = 365 * 24 * 60 * 60 + 10 * 24 * 60 * 60;
    await ethers.provider.send('evm_increaseTime', [anotherYearsAfter]);

    await users[1].Vesting.release();
    expect(await CODE.balanceOf(users[1].address)).to.equal(
      ethers.utils.parseUnits((150_000).toString(), TOKEN_DECIMALS)
    );
    expect(await users[1].Vesting.released(users[1].address)).to.equal(
      ethers.utils.parseUnits((150_000).toString(), TOKEN_DECIMALS)
    );
  });

  it('cannot sweep if claim period not ends', async function () {
    const { CODE, Vesting, treasuryOwnedVesting } = await setup();

    await expect(Vesting.sweep20(CODE.address)).to.be.revertedWith('Ownable: caller is not the owner');

    await expect(treasuryOwnedVesting.sweep20(CODE.address)).to.be.revertedWith('ReleaseNotEnded()');

    const twoYearsAfter = 2 * 365 * 24 * 60 * 60 + 10 * 24 * 60 * 60;
    await ethers.provider.send('evm_increaseTime', [twoYearsAfter]);

    await treasuryOwnedVesting.sweep20(CODE.address);

    const { treasury } = await getNamedAccounts();
    const treasuryBalance = await CODE.balanceOf(treasury);
    expect(treasuryBalance).to.equal(ethers.utils.parseUnits((6_500_000).toString(), TOKEN_DECIMALS));
  });

  it('sweep other erc20 tokens if claim period not ends', async function () {
    const { mockERC20, treasuryOwnedVesting } = await setup();
    const { deployer, treasury } = await getNamedAccounts();

    const mockBalance = await mockERC20.balanceOf(deployer);
    expect(mockBalance).to.equal(ethers.utils.parseUnits((10_000_000).toString(), TOKEN_DECIMALS));
    const tc = await mockERC20.connect(await ethers.getSigner(deployer));

    await tc.transfer(treasuryOwnedVesting.address, ethers.utils.parseUnits((100_000).toString(), TOKEN_DECIMALS));

    const contractBalance = await mockERC20.balanceOf(treasuryOwnedVesting.address);
    expect(contractBalance).to.equal(ethers.utils.parseUnits((100_000).toString(), TOKEN_DECIMALS));

    await treasuryOwnedVesting.sweep20(mockERC20.address);

    const treasuryBalance = await mockERC20.balanceOf(treasury);
    expect(treasuryBalance).to.equal(ethers.utils.parseUnits((100_000).toString(), TOKEN_DECIMALS));
  });

  it('sweep erc721 tokens', async function () {
    const { mockERC721, treasuryOwnedVesting } = await setup();
    const { treasury } = await getNamedAccounts();

    const treasuryBalanceBefore = await mockERC721.balanceOf(treasury);
    expect(treasuryBalanceBefore).to.equal(0);
    const contractBalanceBefore = await mockERC721.balanceOf(treasuryOwnedVesting.address);
    expect(contractBalanceBefore).to.equal(1);

    await treasuryOwnedVesting.sweep721(mockERC721.address, 1);

    const treasuryBalanceAfter = await mockERC721.balanceOf(treasury);
    expect(treasuryBalanceAfter).to.equal(1);
    const contractBalanceAfter = await mockERC721.balanceOf(treasuryOwnedVesting.address);
    expect(contractBalanceAfter).to.equal(0);
  });

  it('ensure claim contract dont receive Ether', async function () {
    const { treasuryOwnedVesting } = await setup();
    const [deployer] = await ethers.getSigners();
    console.log(
      `contract ether balance ${ethers.utils.formatEther(
        await ethers.provider.getBalance(treasuryOwnedVesting.address)
      )}`
    );
    expect(await ethers.provider.getBalance(deployer.address)).to.gt(
      ethers.utils.parseUnits((0).toString(), TOKEN_DECIMALS)
    );
    expect(await ethers.provider.getBalance(treasuryOwnedVesting.address)).to.equal(
      ethers.utils.parseUnits((0).toString(), TOKEN_DECIMALS)
    );
    try {
      // Error: Transaction reverted: function selector was not recognized and there's no fallback nor receive function
      await deployer.sendTransaction({
        to: treasuryOwnedVesting.address,
        value: ethers.utils.parseEther('1.0'),
      });
    } catch {}
    expect(await ethers.provider.getBalance(treasuryOwnedVesting.address)).to.equal(
      ethers.utils.parseUnits((0).toString(), TOKEN_DECIMALS)
    );
  });

  it('only owner can add payee', async function () {
    const { users } = await setup();
    const payees = [users[0].address];
    // shares should sum up to 690_000
    const shares = [ethers.utils.parseUnits((150_000).toString(), TOKEN_DECIMALS)];
    await expect(users[0].Vesting.addOrUpdatePayees(payees, shares)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );
  });
});
