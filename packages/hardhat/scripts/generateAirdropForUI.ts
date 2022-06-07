import { ethers } from 'ethers';
import * as fs from 'fs';
import { getUnnamedAccounts } from 'hardhat';

const TOKEN_AMOUNT_NFT = 400;
const TOKEN_AMOUNT_VOTES_POAP = 399;

const args = process.argv.slice(2);
const nftHoldersPath = args[0];
const votesAndPoapPath = args[1];
const earlyContribPath = args[2];

// TODO early contributors allocation, founding team, advisors, partners

if (!nftHoldersPath) throw new Error('Missing nftHoldersPath as first argument!');
if (!votesAndPoapPath) throw new Error('Missing votesAndPoapPath as second argument!');
if (!earlyContribPath) throw new Error('Missing earlyContribPath as third argument!');

async function main() {
  // Load addresses
  const nftHolders = JSON.parse(fs.readFileSync(nftHoldersPath).toString());
  const votersAndPoapHolders = JSON.parse(fs.readFileSync(votesAndPoapPath).toString());
  const earlyContributors = JSON.parse(fs.readFileSync(earlyContribPath).toString());

  // Create the airdrop structure required by the generator
  const airdropForUI: Record<string, { nft: number; voter: number; earlyContrib: number }> = {};

  // NFT Holders allocation
  nftHolders.addresses.forEach((address: string) => {
    const formattedAddress = ethers.utils.getAddress(address);

    airdropForUI[formattedAddress] = {
      nft: TOKEN_AMOUNT_NFT,
      voter: 0,
      earlyContrib: 0,
    };
  });

  // Voters & POAP holders allocation
  votersAndPoapHolders.eligible_address.forEach(({ address }: { address: string }) => {
    const formattedAddress = ethers.utils.getAddress(address);

    if (!(formattedAddress in airdropForUI)) {
      airdropForUI[formattedAddress] = {
        nft: 0,
        voter: TOKEN_AMOUNT_VOTES_POAP,
        earlyContrib: 0,
      };
    } else {
      airdropForUI[formattedAddress].voter = TOKEN_AMOUNT_VOTES_POAP;
    }
  });

  earlyContributors.early_contributor_allocations.forEach(
    ({ address, tokens }: { address: string; tokens: string }) => {
      const formattedAddress = ethers.utils.getAddress(address);
      const contribAmount = parseFloat(tokens.replace(',', ''));
      let tgeAmount = contribAmount;
      // https://forum.developerdao.com/t/draft-ratify-the-early-contributor-allocations-of-code/2065
      // Any $CODE amount above 20,000 $CODE will be subject to vesting.
      if (tgeAmount > 20000) {
        tgeAmount = 20000;
      }

      if (!(formattedAddress in airdropForUI)) {
        airdropForUI[formattedAddress] = {
          nft: 0,
          voter: 0,
          earlyContrib: tgeAmount,
        };
      } else {
        airdropForUI[formattedAddress].earlyContrib = tgeAmount;
      }
    }
  );

  // Add localhost addresses for testing
  if (process.env.HARDHAT_NETWORK === 'localhost') {
    const testAccounts = await getUnnamedAccounts();
    airdropForUI[ethers.utils.getAddress(testAccounts[0])] = { nft: TOKEN_AMOUNT_NFT, voter: 0, earlyContrib: 0 };
    airdropForUI[ethers.utils.getAddress(testAccounts[1])] = {
      nft: TOKEN_AMOUNT_NFT,
      voter: TOKEN_AMOUNT_VOTES_POAP,
      earlyContrib: 0,
    };

    console.warn('Added test account allocations for:');
    console.warn(testAccounts[0], airdropForUI[ethers.utils.getAddress(testAccounts[0])]);
    console.warn(testAccounts[1], airdropForUI[ethers.utils.getAddress(testAccounts[1])]);
  }

  // Write the JSON to file, to be copied to the UI
  fs.writeFileSync(
    `data/out/airdrop_ui_${process.env.HARDHAT_NETWORK}.json`,
    JSON.stringify({ airdrop: airdropForUI }, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
