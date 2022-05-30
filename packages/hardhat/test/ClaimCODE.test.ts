import { expect } from './chai-setup';
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from 'hardhat';
import { ClaimCODE, CODE } from '../../next-app/src/typechain';
import { setupUsers } from './utils';
import { generateLeaf } from './utils/merkleUtils';

import MerkleGenerator from '../utils/merkleGenerator';

const TOKEN_DECIMALS = 18;

const setup = deployments.createFixture(async () => {
  await deployments.fixture(['ClaimCODE']);

  const merkleProofCf = await ethers.getContractFactory('MerkleProofWrapper');
  const merkleProof = await merkleProofCf.deploy();
  await merkleProof.deployed();

  const mockERC20Cf = await ethers.getContractFactory('MockERC20');
  const mockERC20 = await mockERC20Cf.deploy();
  await mockERC20.deployed();

  const mockERC721Cf = await ethers.getContractFactory('MockERC721');
  const mockERC721 = await mockERC721Cf.deploy();
  await mockERC721.deployed();

  const unnamedAccounts = await getUnnamedAccounts();
  const airdrop = {
    [unnamedAccounts[1]]: 100,
    [unnamedAccounts[2]]: 200,
    [unnamedAccounts[3]]: 300,
  };
  console.log(airdrop);

  const generator = new MerkleGenerator(TOKEN_DECIMALS, airdrop);
  const { merkleRoot, merkleTree } = await generator.process();

  const CODE = <CODE>await ethers.getContract('CODE');
  const ClaimCODE = <ClaimCODE>await ethers.getContract('ClaimCODE');
  const users = await setupUsers(unnamedAccounts, { ClaimCODE });

  const { treasury } = await getNamedAccounts();
  const treasuryOwnedClaimCODE = await ClaimCODE.connect(await ethers.getSigner(treasury));

  await treasuryOwnedClaimCODE.setMerkleRoot(merkleRoot);

  await mockERC721.mintTo(treasury);
  const treasuryOwnedNFT = await mockERC721.connect(await ethers.getSigner(treasury));
  await treasuryOwnedNFT.transferFrom(treasury, ClaimCODE.address, 1);

  return {
    CODE,
    ClaimCODE,
    mockERC20,
    mockERC721,
    treasuryOwnedClaimCODE,
    merkleTree,
    merkleRoot,
    merkleProof,
    users,
  };
});

describe('Claim CODE', function () {
  it('Deployment should assign treasury & airdrop supply of tokens correctly', async function () {
    const { CODE, ClaimCODE } = await setup();
    const { treasury } = await getNamedAccounts();
    const treasuryBalance = await CODE.balanceOf(treasury);
    const airdropBalance = await CODE.balanceOf(ClaimCODE.address);
    // trasnfered from treasury to vesting
    expect(treasuryBalance).to.equal(ethers.utils.parseUnits((6_500_000 - 690_000 / 2).toString(), TOKEN_DECIMALS));
    expect(airdropBalance).to.equal(ethers.utils.parseUnits((3_500_000).toString(), TOKEN_DECIMALS));
  });

  it('Deployment should assign treasury as the owner of claim contract', async function () {
    const { ClaimCODE } = await setup();
    const { treasury } = await getNamedAccounts();
    const owner = await ClaimCODE.owner();
    expect(treasury).to.equal(owner);
  });

  it('cannot claim if no allocation', async function () {
    const { users, merkleTree } = await setup();

    // Get properly formatted address
    const formattedAddress: string = ethers.utils.getAddress(users[0].address);

    // Get tokens for address
    const numTokens: string = ethers.utils.parseUnits('100', TOKEN_DECIMALS).toString();

    // Generate hashed leaf from address
    const leaf: Buffer = generateLeaf(formattedAddress, numTokens);
    // Generate airdrop proof
    const proof: string[] = merkleTree.getHexProof(leaf);

    await expect(users[0].ClaimCODE.claimTokens(numTokens, proof)).to.be.revertedWith('InvalidProof()');
  });

  it('can claim correct allocation amount only', async function () {
    const { users, merkleProof, merkleRoot, merkleTree, CODE, ClaimCODE } = await setup();

    // Get tokens for address correctly
    const correctFormattedAddress: string = ethers.utils.getAddress(users[1].address);
    const correctNumTokens: string = ethers.utils.parseUnits('100', TOKEN_DECIMALS).toString();
    const correctLeaf: Buffer = generateLeaf(correctFormattedAddress, correctNumTokens);
    const correctProof: string[] = merkleTree.getHexProof(correctLeaf);
    const result = await merkleProof.verify(correctProof, merkleRoot, correctLeaf);
    const correctIndex = result[1].toNumber();

    const isClaimed = await ClaimCODE.isClaimed(correctIndex);
    expect(isClaimed).to.be.false;

    await expect(users[1].ClaimCODE.claimTokens(correctNumTokens, correctProof))
      .to.emit(ClaimCODE, 'Claim')
      .withArgs(correctFormattedAddress, ethers.utils.parseUnits((100).toString(), TOKEN_DECIMALS));

    const userBalance = await CODE.balanceOf(users[1].address);
    expect(userBalance).to.equal(ethers.utils.parseUnits((100).toString(), TOKEN_DECIMALS));

    const isClaimedAfter = await ClaimCODE.isClaimed(correctIndex);
    expect(isClaimedAfter).to.be.true;

    await expect(users[1].ClaimCODE.claimTokens(correctNumTokens, correctProof)).to.be.revertedWith('AlreadyClaimed()');
  });

  it('cannot claim if claim period ends', async function () {
    const { users, merkleTree } = await setup();
    // Get properly formatted address
    const formattedAddress: string = ethers.utils.getAddress(users[1].address);

    // Get tokens for address
    const numTokens: string = ethers.utils.parseUnits('100', TOKEN_DECIMALS).toString();

    // Generate hashed leaf from address
    const leaf: Buffer = generateLeaf(formattedAddress, numTokens);
    // Generate airdrop proof
    const proof: string[] = merkleTree.getHexProof(leaf);
    const ninetyOneDays = 91 * 24 * 60 * 60;
    await ethers.provider.send('evm_increaseTime', [ninetyOneDays]);

    await expect(users[1].ClaimCODE.claimTokens(numTokens, proof)).to.be.revertedWith('ClaimEnded()');
  });

  it('cannot reset merkleroot', async function () {
    const { treasuryOwnedClaimCODE, merkleRoot } = await setup();
    await expect(treasuryOwnedClaimCODE.setMerkleRoot(merkleRoot)).to.be.revertedWith('InitError()');
  });

  it('cannot claim if contract is paused', async function () {
    const { users, merkleRoot, merkleProof, merkleTree, CODE, ClaimCODE, treasuryOwnedClaimCODE } = await setup();

    const userId = 2;
    const userAmount = 200;

    // Get tokens for address correctly
    const correctFormattedAddress: string = ethers.utils.getAddress(users[userId].address);
    const correctNumTokens: string = ethers.utils.parseUnits(userAmount.toString(), TOKEN_DECIMALS).toString();
    const correctLeaf: Buffer = generateLeaf(correctFormattedAddress, correctNumTokens);
    const correctProof: string[] = merkleTree.getHexProof(correctLeaf);
    const result = await merkleProof.verify(correctProof, merkleRoot, correctLeaf);
    const correctIndex = result[1].toNumber();

    await treasuryOwnedClaimCODE.pause();

    await expect(users[userId].ClaimCODE.claimTokens(correctNumTokens, correctProof)).to.be.revertedWith(
      'Pausable: paused'
    );

    await treasuryOwnedClaimCODE.unpause();

    const isClaimed = await ClaimCODE.isClaimed(correctIndex);
    expect(isClaimed).to.be.false;

    await expect(users[userId].ClaimCODE.claimTokens(correctNumTokens, correctProof))
      .to.emit(ClaimCODE, 'Claim')
      .withArgs(correctFormattedAddress, ethers.utils.parseUnits(userAmount.toString(), TOKEN_DECIMALS));

    const userBalance = await CODE.balanceOf(users[userId].address);
    expect(userBalance).to.equal(ethers.utils.parseUnits(userAmount.toString(), TOKEN_DECIMALS));

    const isClaimedAfter = await ClaimCODE.isClaimed(correctIndex);
    console.log('after:', isClaimedAfter);
    expect(isClaimedAfter).to.be.true;
  });

  it('cannot sweep if claim period not ends', async function () {
    const { CODE, ClaimCODE, treasuryOwnedClaimCODE } = await setup();

    await expect(ClaimCODE.sweep20(CODE.address)).to.be.revertedWith('Ownable: caller is not the owner');

    await expect(treasuryOwnedClaimCODE.sweep20(CODE.address)).to.be.revertedWith('ClaimNotEnded()');

    const ninetyOneDays = 91 * 24 * 60 * 60;
    await ethers.provider.send('evm_increaseTime', [ninetyOneDays]);

    await treasuryOwnedClaimCODE.sweep20(CODE.address);

    const { treasury } = await getNamedAccounts();
    const treasuryBalance = await CODE.balanceOf(treasury);
    // trasnfered from treasury to vesting
    expect(treasuryBalance).to.equal(ethers.utils.parseUnits((10_000_000 - 690_000 / 2).toString(), TOKEN_DECIMALS));
  });

  it('sweep other erc20 tokens if claim period not ends', async function () {
    const { mockERC20, treasuryOwnedClaimCODE } = await setup();
    const { deployer, treasury } = await getNamedAccounts();

    const mockBalance = await mockERC20.balanceOf(deployer);
    expect(mockBalance).to.equal(ethers.utils.parseUnits((10_000_000).toString(), TOKEN_DECIMALS));
    const tc = await mockERC20.connect(await ethers.getSigner(deployer));

    await tc.transfer(treasuryOwnedClaimCODE.address, ethers.utils.parseUnits((100_000).toString(), TOKEN_DECIMALS));

    const contractBalance = await mockERC20.balanceOf(treasuryOwnedClaimCODE.address);
    expect(contractBalance).to.equal(ethers.utils.parseUnits((100_000).toString(), TOKEN_DECIMALS));

    await treasuryOwnedClaimCODE.sweep20(mockERC20.address);

    const treasuryBalance = await mockERC20.balanceOf(treasury);
    expect(treasuryBalance).to.equal(ethers.utils.parseUnits((100_000).toString(), TOKEN_DECIMALS));
  });

  it('sweep erc721 tokens', async function () {
    const { mockERC721, treasuryOwnedClaimCODE } = await setup();
    const { treasury } = await getNamedAccounts();

    const treasuryBalanceBefore = await mockERC721.balanceOf(treasury);
    expect(treasuryBalanceBefore).to.equal(0);
    const contractBalanceBefore = await mockERC721.balanceOf(treasuryOwnedClaimCODE.address);
    expect(contractBalanceBefore).to.equal(1);

    await treasuryOwnedClaimCODE.sweep721(mockERC721.address, 1);

    const treasuryBalanceAfter = await mockERC721.balanceOf(treasury);
    expect(treasuryBalanceAfter).to.equal(1);
    const contractBalanceAfter = await mockERC721.balanceOf(treasuryOwnedClaimCODE.address);
    expect(contractBalanceAfter).to.equal(0);
  });

  it('ensure claim contract dont receive Ether', async function () {
    const { treasuryOwnedClaimCODE } = await setup();
    const [deployer] = await ethers.getSigners();
    console.log(
      `contract ether balance ${ethers.utils.formatEther(
        await ethers.provider.getBalance(treasuryOwnedClaimCODE.address)
      )}`
    );
    expect(await ethers.provider.getBalance(deployer.address)).to.gt(
      ethers.utils.parseUnits((0).toString(), TOKEN_DECIMALS)
    );
    expect(await ethers.provider.getBalance(treasuryOwnedClaimCODE.address)).to.equal(
      ethers.utils.parseUnits((0).toString(), TOKEN_DECIMALS)
    );
    try {
      // Error: Transaction reverted: function selector was not recognized and there's no fallback nor receive function
      await deployer.sendTransaction({
        to: treasuryOwnedClaimCODE.address,
        value: ethers.utils.parseEther('1.0'),
      });
    } catch {}
    expect(await ethers.provider.getBalance(treasuryOwnedClaimCODE.address)).to.equal(
      ethers.utils.parseUnits((0).toString(), TOKEN_DECIMALS)
    );
  });
});
