import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Box, Flex } from "@chakra-ui/react";

import { CODEToken__factory } from "@/typechain";
import { hasEthereum } from "@/utils";

import {
  ClaimCard,
  ClaimCardData,
  ClaimCardState,
} from "@/components/ClaimCard";
import { Logo } from "@/components/Logo";
import { MainBox } from "@/components/MainBox";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const Home: NextPage = () => {
  const [claimPeriodEnds, setClaimPeriodEnds] = useState(0);
  const isConnected = true;

  const claimCardData: ClaimCardData = {
    state: ClaimCardState.unclaimed,
    address: "jazza.eth",
    avatar: "",
    allocations: {
      member: "400",
      voterOrPoap: "0",
      earlyContributor: "1042",
      total: "1442",
    },
  };

  async function fetchStore() {
    if (hasEthereum()) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tokenContract = CODEToken__factory.connect(
        contractAddress,
        provider
      );
      try {
        const data = await tokenContract.claimPeriodEnds();
        setClaimPeriodEnds(data.toNumber());
      } catch (err) {
        console.log("EfetchStorerror: ", err);
      }
    }
  }

  useEffect(() => {
    fetchStore();
  }, []);

  return (
    <Box m="0" w="100vw" h="100vh" background="blue">
      <Head>
        <title>$CODE Claim Page</title>
      </Head>
      <Flex direction="row" flexWrap="wrap">
        <Box
          w={{ base: "100vw", lg: "50vw" }}
          h="100vh"
          m="0"
          pl={["24px", "5vw"]}
          pr={["40px", "8vw"]}
          background="#08010D"
        >
          <Box mt={["32px", "48px"]} mb="22vh">
            <Logo />
          </Box>
          <MainBox isConnected={isConnected} />
        </Box>
        <Flex
          w={{ base: "100vw", lg: "50vw" }}
          h="100vh"
          m="0"
          backgroundColor="#F1F0F5"
          align="center"
          justifyContent="center"
        >
          <Flex
            position="absolute"
            top={["24px", "5vh"]}
            right={["24px", "5vw"]}>
            <a target="view_window" href="https://discord.com/channels/883478451850473483/883495211064524811" style={{ fontSize: '18px', color: '#08010D' }}>Discord</a>
            <Box pl={["24px", "5vw"]}>
              <a target="view_window" href="https://twitter.com/developer_dao?s=11" style={{ fontSize: '18px', color: '#08010D' }}>Twitter</a>
            </Box>
          </Flex>

          <Box m={["24px", "10vw"]}>
            <ClaimCard data={claimCardData} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Home;
