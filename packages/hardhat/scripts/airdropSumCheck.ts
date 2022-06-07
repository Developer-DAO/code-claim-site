import * as fs from 'fs';
import { assert } from 'console';

const args = process.argv.slice(2);
const airdropSumPath = args[0];

if (!airdropSumPath) throw new Error('Missing airdropSumPath as first argument!');

const EXPECTED_SUM = 3_500_000;

async function main() {
  const airdropData = JSON.parse(fs.readFileSync(airdropSumPath).toString());

  const airdropSum = Object.entries(airdropData.airdrop).reduce((acc, entry) => {
    return acc + (entry[1] as number);
  }, 0);
  console.log(airdropSum);

  assert(airdropSum <= EXPECTED_SUM);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
