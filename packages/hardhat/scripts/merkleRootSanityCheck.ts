import { ethers, getNamedAccounts } from 'hardhat';
import { ClaimCODE } from '../../next-app/src/typechain';
import airdropData from '../../next-app/src/data/airdrop';
import { generateMerkleTree, getMerkleTreeValues, verify } from '../../next-app/src/utils/merkletree';
import { ok, equal } from 'assert';

// the sanity check data is directly from the frontend in production
const airdrop: Record<string, { nft: number; voter: number; earlyContrib: number }> = airdropData.airdrop;
const merkleTree = generateMerkleTree(airdrop);
console.info(`local merkle root: ${merkleTree.getHexRoot()}`);

async function main() {
  const { treasury } = await getNamedAccounts();

  const claimContract = <ClaimCODE>await ethers.getContract('ClaimCODE', treasury);
  console.log('claim contract address:', claimContract.address);
  const contractMerkleRoot = await claimContract.merkleRoot();
  console.log('contract merkle root:', contractMerkleRoot);
  equal(merkleTree.getHexRoot(), contractMerkleRoot, "merkle root assert fail");

  const arr = Object.entries(airdrop);

  const idxEntries = new Set<number>();

  for (let idx = 0; idx < arr.length; idx++) {
    await (async () => {
      const [address, allocation] = arr[idx];
      console.log(`sanity checking for ${address}`);

      const totalAllocation = allocation.nft + allocation.voter + allocation.earlyContrib;
      const { leaf, proof } = getMerkleTreeValues(merkleTree, address, totalAllocation);
      const [isVerifiedLocal, indexLocal] = verify(proof, merkleTree.getHexRoot(), '0x' + leaf.toString('hex'));
      const [isVerified, index] = await claimContract.verify(proof, leaf);

      // ensure the verify logic used in frontend is exactly the same with the contract
      ok(isVerifiedLocal, "proof not verify locally");
      ok(isVerified, "proof not verify online");
      equal(indexLocal, index.toNumber(), `proof index assert fail ${indexLocal} != ${index.toNumber()}`);
      ok(indexLocal >= 0, `proof index ${indexLocal} illformed`);

      idxEntries.add(index.toNumber());
      console.log(`sanity checked for ${address}`);
    })();
  }

  // ensure each idx is unique
  ok(idxEntries.size == arr.length, "duplicated proof index");
  console.log('sanity checked for indexes');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
