import { expect } from './chai-setup';
import { ethers, deployments, getNamedAccounts } from 'hardhat';
import { CODE } from '../../next-app/src/typechain';

const TOKEN_DECIMALS = 18;

const setup = deployments.createFixture(async () => {
  await deployments.fixture(['CODE']);

  const mockERC20Cf = await ethers.getContractFactory('MockERC20');
  const mockERC20 = await mockERC20Cf.deploy();
  await mockERC20.deployed();

  const mockERC721Cf = await ethers.getContractFactory('MockERC721');
  const mockERC721 = await mockERC721Cf.deploy();
  await mockERC721.deployed();

  const CODE = <CODE>await ethers.getContract('CODE');

  const { treasury } = await getNamedAccounts();
  const treasuryOwnedCODE = await CODE.connect(await ethers.getSigner(treasury));

  await mockERC721.mintTo(treasury);
  const treasuryOwnedNFT = await mockERC721.connect(await ethers.getSigner(treasury));
  await treasuryOwnedNFT.transferFrom(treasury, CODE.address, 1);

  return {
    CODE,
    mockERC20,
    mockERC721,
    treasuryOwnedCODE,
  };
});

describe('CODE', function () {
  it('Only mint role can mint new token', async function () {
    const { CODE } = await setup();
    const { deployer, treasury } = await getNamedAccounts();

    const adminRole = await CODE.DEFAULT_ADMIN_ROLE();
    expect(await CODE.hasRole(adminRole, deployer)).to.be.false;
    expect(await CODE.hasRole(adminRole, treasury)).to.be.true;

    const dc = await CODE.connect(await ethers.getSigner(deployer));
    const mintRole = await CODE.MINTER_ROLE();
    await expect(dc.mint(treasury, ethers.utils.parseUnits((100_000).toString(), TOKEN_DECIMALS))).to.be.revertedWith(
      `AccessControl: account ${deployer.toLowerCase()} is missing role ${mintRole}`
    );

    const treasuryBalExp = 6_500_000 - 690_000 / 2; // trasnfered from treasury to vesting

    const treasuryBalance = await CODE.balanceOf(treasury);
    expect(treasuryBalance).to.equal(ethers.utils.parseUnits(treasuryBalExp.toString(), TOKEN_DECIMALS));

    const tc = await CODE.connect(await ethers.getSigner(treasury));
    await tc.grantRole(mintRole, deployer);

    await dc.mint(treasury, ethers.utils.parseUnits((100_000).toString(), TOKEN_DECIMALS));

    const treasuryBalanceAfter = await CODE.balanceOf(treasury);
    expect(treasuryBalanceAfter).to.equal(
      ethers.utils.parseUnits((treasuryBalExp + 100_000).toString(), TOKEN_DECIMALS)
    );

    await tc.revokeRole(mintRole, deployer);

    await expect(dc.mint(treasury, ethers.utils.parseUnits((100_000).toString(), TOKEN_DECIMALS))).to.be.revertedWith(
      `AccessControl: account ${deployer.toLowerCase()} is missing role ${mintRole}`
    );
  });

  it('sweep erc20 tokens', async function () {
    const { CODE, mockERC20, treasuryOwnedCODE } = await setup();
    const { deployer, treasury } = await getNamedAccounts();

    const mockBalance = await mockERC20.balanceOf(deployer);
    expect(mockBalance).to.equal(ethers.utils.parseUnits((10_000_000).toString(), TOKEN_DECIMALS));
    const dc = await mockERC20.connect(await ethers.getSigner(deployer));

    await dc.transfer(treasuryOwnedCODE.address, ethers.utils.parseUnits((100_000).toString(), TOKEN_DECIMALS));

    const contractBalance = await mockERC20.balanceOf(treasuryOwnedCODE.address);
    expect(contractBalance).to.equal(ethers.utils.parseUnits((100_000).toString(), TOKEN_DECIMALS));

    const sweepRole = await CODE.SWEEP_ROLE();
    const tc = await CODE.connect(await ethers.getSigner(treasury));
    await tc.grantRole(sweepRole, treasury);

    await treasuryOwnedCODE.sweep20(mockERC20.address, treasury);

    const treasuryBalance = await mockERC20.balanceOf(treasury);
    expect(treasuryBalance).to.equal(ethers.utils.parseUnits((100_000).toString(), TOKEN_DECIMALS));
  });

  it('sweep erc721 tokens', async function () {
    const { CODE, mockERC721, treasuryOwnedCODE } = await setup();
    const { treasury } = await getNamedAccounts();

    const treasuryBalanceBefore = await mockERC721.balanceOf(treasury);
    expect(treasuryBalanceBefore).to.equal(0);
    const contractBalanceBefore = await mockERC721.balanceOf(treasuryOwnedCODE.address);
    expect(contractBalanceBefore).to.equal(1);

    const sweepRole = await CODE.SWEEP_ROLE();
    const tc = await CODE.connect(await ethers.getSigner(treasury));
    await tc.grantRole(sweepRole, treasury);

    await treasuryOwnedCODE.sweep721(mockERC721.address, treasury, 1);

    const treasuryBalanceAfter = await mockERC721.balanceOf(treasury);
    expect(treasuryBalanceAfter).to.equal(1);
    const contractBalanceAfter = await mockERC721.balanceOf(treasuryOwnedCODE.address);
    expect(contractBalanceAfter).to.equal(0);
  });

  it('ensure claim contract dont receive Ether', async function () {
    const { treasuryOwnedCODE } = await setup();
    const [deployer] = await ethers.getSigners();
    console.log(
      `contract ether balance ${ethers.utils.formatEther(await ethers.provider.getBalance(treasuryOwnedCODE.address))}`
    );
    expect(await ethers.provider.getBalance(deployer.address)).to.gt(
      ethers.utils.parseUnits((0).toString(), TOKEN_DECIMALS)
    );
    expect(await ethers.provider.getBalance(treasuryOwnedCODE.address)).to.equal(
      ethers.utils.parseUnits((0).toString(), TOKEN_DECIMALS)
    );
    try {
      // Error: Transaction reverted: function selector was not recognized and there's no fallback nor receive function
      await deployer.sendTransaction({
        to: treasuryOwnedCODE.address,
        value: ethers.utils.parseEther('1.0'),
      });
    } catch {}
    expect(await ethers.provider.getBalance(treasuryOwnedCODE.address)).to.equal(
      ethers.utils.parseUnits((0).toString(), TOKEN_DECIMALS)
    );
  });
});
