set -e
set -x

network="${1:-mainnet}"

yarn execute $network scripts/getMerkleRoot.ts \
    $(pwd)/packages/hardhat/data/nft_holders.json \
    $(pwd)/packages/hardhat/data/votes_and_poap_holders.json \
    $(pwd)/packages/hardhat/data/final_early_contributor_amounts.json

yarn execute $network scripts/generateAirdropForUI.ts \
    $(pwd)/packages/hardhat/data/nft_holders.json \
    $(pwd)/packages/hardhat/data/votes_and_poap_holders.json \
    $(pwd)/packages/hardhat/data/final_early_contributor_amounts.json

yarn execute $network scripts/airdropSumCheck \
    $(pwd)/packages/hardhat/data/out/airdrop_$network.json
