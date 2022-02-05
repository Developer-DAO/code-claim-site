import { Box, Button, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import { MouseEventHandler, useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import MerkleTree from "merkletreejs";
import { ethers } from "ethers";
import keccak256 from "keccak256";

import { CODEToken__factory } from "@/typechain";
import { getContractAddress, maskWalletAddress } from "@/utils";

import airdropData from "../data/airdrop";

const TOKEN_DECIMALS = 18;

const airdrop: Record<
  string,
  { nft: number; voter: number; earlyContrib: number }
> = airdropData.airdrop;

// Helper function to generate leafs
function generateLeaf(address: string, value: string): Buffer {
  return Buffer.from(
    // Hash in appropriate Merkle format
    ethers.utils
      .solidityKeccak256(["address", "uint256"], [address, value])
      .slice(2),
    "hex"
  );
}

// Setup merkle tree
const merkleTree = new MerkleTree(
  Object.entries(airdrop).map(([address, allocation]) =>
    generateLeaf(
      ethers.utils.getAddress(address),
      ethers.utils
        .parseUnits(
          (
            allocation.nft +
            allocation.voter +
            allocation.earlyContrib
          ).toString(),
          TOKEN_DECIMALS
        )
        .toString()
    )
  ),
  keccak256,
  {
    sortPairs: true,
  }
);

// This is a port of the verify logic in  packages\hardhat\src\MerkleProof.sol
function verify(
  proof: string[],
  root: string,
  leaf: string
): [boolean, number] {
  let computedHash = Buffer.from(leaf.slice(2), "hex");
  let index = 0;

  for (let i = 0; i < proof.length; i++) {
    index *= 2;
    const proofElement = Buffer.from(proof[i].slice(2), "hex");

    if (computedHash.toString("hex") <= proofElement.toString("hex")) {
      // Hash(current computed hash + current element of the proof)
      computedHash = Buffer.from(
        ethers.utils
          .solidityKeccak256(
            ["bytes32", "bytes32"],
            [
              "0x" + computedHash.toString("hex").padStart(64, "0"),
              "0x" + proofElement.toString("hex").padStart(64, "0"),
            ]
          )
          .slice(2),
        "hex"
      );
    } else {
      // Hash(current element of the proof + current computed hash)
      computedHash = Buffer.from(
        ethers.utils
          .solidityKeccak256(
            ["bytes32", "bytes32"],
            [
              "0x" + proofElement.toString("hex").padStart(64, "0"),
              "0x" + computedHash.toString("hex").padStart(64, "0"),
            ]
          )
          .slice(2),
        "hex"
      );

      index += 1;
    }
  }

  // Check if the computed hash (root) is equal to the provided root
  return ["0x" + computedHash.toString("hex") === root, index];
}

function getMerkleTreeValues(address: string, tokenAmount: number) {
  const numTokens = ethers.utils
    .parseUnits(tokenAmount.toString(), TOKEN_DECIMALS)
    .toString();

  const leaf = generateLeaf(ethers.utils.getAddress(address), numTokens);
  const proof = merkleTree.getHexProof(leaf);

  return { leaf, proof, numTokens };
}

export enum ClaimCardState {
  disconnected,
  unclaimed,
  isClaiming,
  claimed,
  notEligible,
}

const Avatar = () => {
  return (
    <Box
      background="gray.200"
      w={["96px", "120px"]}
      h={["96px", "120px"]}
      borderRadius="16px"
    />
  );
};

const ButtonPlaceholder = () => (
  <Box background="gray.200" borderRadius="12px" w="100%" h="56px" mt="24px" />
);

const ClaimButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => (
  <Button
    background="#08010D"
    borderRadius="12px"
    color="#FFF"
    fontSize={["16px", "18px"]}
    fontWeight="900"
    w="100%"
    h="56px"
    _active={{}}
    _hover={{
      transform:
        "translate3d(0px, -2px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
      transformStyle: "preserve-3d",
    }}
    onClick={onClick}
  >
    <Text>
      CLAIM{" "}
      <span style={{ fontFamily: "IBM Plex Mono", fontWeight: 600 }}>
        {label}
      </span>{" "}
      TOKENS
    </Text>
  </Button>
);

interface HeaderData {
  address: string;
  image: string;
  showLabel: boolean;
  showPlaceholder: boolean;
}

const Header = ({ address, image, showLabel, showPlaceholder }: HeaderData) => (
  <Flex align="center">
    <Avatar />
    <Flex direction="column" ml={["20px", "32px"]}>
      {showLabel && (
        <Flex align="center">
          <Image
            src="assets/eligible-check.svg"
            alt="check"
            w="20px"
            h="20px"
            mr="8px"
          />
          <Text color="#4E4853" fontSize={["16px", "18px"]} fontWeight="500">
            Eligible wallet
          </Text>
        </Flex>
      )}
      <Text
        color="#08010D"
        fontSize={["32px", "42px"]}
        fontWeight="500"
        mt="-8px"
      >
        {address}
      </Text>
    </Flex>
  </Flex>
);

const Position = ({
  title,
  value,
  isBig = false,
}: {
  title: string;
  value: string;
  isBig: boolean;
}) => (
  <Flex direction="column">
    <Flex direction="row" align="baseline" px="24px">
      <Text
        color={isBig ? "#08010D" : "#4E4853"}
        fontSize={isBig ? "24px" : "18px"}
        fontWeight="500"
      >
        {title}
      </Text>
      <Spacer />
      <Text
        color={isBig ? "#08010D" : "#4E4853"}
        fontFamily="IBM Plex Mono"
        fontSize={isBig ? "32px" : "24px"}
        fontWeight="400"
      >
        {value}
      </Text>
    </Flex>
  </Flex>
);

const contractAddress = getContractAddress();

export const ClaimCard = ({
  setConfetti,
}: {
  setConfetti: CallableFunction;
}) => {
  const [cardState, setCardState] = useState(ClaimCardState.disconnected);

  const [{ data: signer, error, loading }] = useSigner();
  const [{ data: accountData }] = useAccount({
    fetchEns: true,
  });

  const allocations =
    accountData?.address &&
    ethers.utils.getAddress(accountData.address) in airdrop
      ? airdrop[ethers.utils.getAddress(accountData.address)]
      : { nft: 0, voter: 0, earlyContrib: 0 };

  const totalAllocation =
    allocations.nft + allocations.voter + allocations.earlyContrib;

  const positions = [
    { title: "Minted D4R NFT", value: allocations.nft },
    { title: "Pre Season 0 activity", value: allocations.voter },
    { title: "Early Contributor", value: allocations.earlyContrib },
  ];

  const isEligible = totalAllocation > 0;

  // Format address
  let formattedAddress = "";
  if (accountData?.address) {
    formattedAddress = maskWalletAddress(accountData.address);
  }

  // Effect to set initial state after account connected
  useEffect(() => {
    const checkAlreadyClaimed = async () => {
      if (signer && cardState === ClaimCardState.disconnected) {
        if (!isEligible) {
          setCardState(ClaimCardState.notEligible);
        } else {
          // Check whether already claimed

          const accountAddress = await signer.getAddress();

          const { leaf, proof } = getMerkleTreeValues(
            accountAddress,
            totalAllocation
          );

          const [isVerified, index] = verify(
            proof,
            merkleTree.getHexRoot(),
            "0x" + leaf.toString("hex")
          );

          console.log(isVerified);
          console.log(index);

          if (!isVerified) return console.error("Couldn't verify proof!");

          const tokenContract = CODEToken__factory.connect(
            contractAddress,
            signer
          );
          const isClaimed = await tokenContract.isClaimed(index);

          if (isClaimed) setConfetti({ state: true });

          setCardState(
            isClaimed ? ClaimCardState.claimed : ClaimCardState.unclaimed
          );
        }
      }
    };

    checkAlreadyClaimed();
  }, [signer, cardState, isEligible, totalAllocation]);

  return (
    <Flex
      w="100%"
      backdropFilter="blur(300px)"
      background="rgba(255, 255, 255, 0.5)"
      border="3px solid #DEDEDE"
      borderRadius="24px"
      box-shadow="inset 0px 0px 100px rgba(255, 255, 255, 0.25)"
      direction="column"
    >
      <Box p="24px">
        <Header
          address={accountData?.ens?.name || formattedAddress || ""}
          image={accountData?.ens?.avatar || ""}
          showLabel={
            cardState !== ClaimCardState.disconnected &&
            cardState !== ClaimCardState.notEligible
          }
          showPlaceholder={cardState === ClaimCardState.disconnected}
        />
      </Box>
      <Flex direction="column" mb="8">
        <Box border="1px solid #08010D" opacity="8%" />
        {positions.map((pos, index) => {
          return (
            <Box key={index} my="2">
              <Position
                title={pos.title}
                value={pos.value.toString()}
                isBig={false}
              />
            </Box>
          );
        })}
        <Box border="1px solid #08010D" opacity="8%" my="4" />
        <Box>
          <Position
            title="$CODE allocation"
            value={totalAllocation.toString()}
            isBig={true}
          />
        </Box>
      </Flex>
      <Box px="24px" pb="24px">
        {cardState === ClaimCardState.disconnected ? (
          <ButtonPlaceholder />
        ) : cardState === ClaimCardState.claimed ? (
          <ButtonPlaceholder />
        ) : (
          <ClaimButton
            label={totalAllocation.toString()}
            onClick={async () => {
              if (!isEligible) return console.warn("Not eligibile!");
              if (!signer) return console.warn("Not connected!");

              const tokenContract = CODEToken__factory.connect(
                contractAddress,
                signer
              );

              const contractMerkleRoot = await tokenContract.merkleRoot();

              if (merkleTree.getHexRoot() !== contractMerkleRoot)
                throw new Error("Local & Contract merkle root's aren't equal!");

              const accountAddress = await signer.getAddress();

              const { proof, numTokens } = getMerkleTreeValues(
                accountAddress,
                totalAllocation
              );

              try {
                setCardState(ClaimCardState.isClaiming);
                const tx = await tokenContract.claimTokens(numTokens, proof);
                await tx.wait(1);
                setCardState(ClaimCardState.claimed);
                console.warn("TODO: show confetti etc");
              } catch (e) {
                setCardState(ClaimCardState.unclaimed);
                console.error(`Error when claiming tokens: ${e}`);
                console.log(e);
              }
            }}
          />
        )}
      </Box>
    </Flex>
  );
};
