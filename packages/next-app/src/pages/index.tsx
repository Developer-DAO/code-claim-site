import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Box, Flex } from "@chakra-ui/react";

import { useAccount, useConnect, useNetwork } from "wagmi";
import { CODEToken__factory } from "@/typechain";
import { hasEthereum, maskWalletAddress } from "@/utils";

import {
  ClaimCard,
  ClaimCardData,
  ClaimCardState,
} from "@/components/ClaimCard";
import { Logo } from "@/components/Logo";
import { MainBox } from "@/components/MainBox";

import Confetti from "react-confetti";
import useWindowDimensions from "@/hooks/useWindowDimensions";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const Home: NextPage = () => {
  const { width, height } = useWindowDimensions();
  const [claimPeriodEnds, setClaimPeriodEnds] = useState(0);
  const [claimCardData, setClaimCardData] = useState({
    state: ClaimCardState.unclaimed,
    address: "jazza.eth",
    avatar: "",
    allocations: {
      member: "400",
      voterOrPoap: "0",
      earlyContributor: "1042",
      total: "1442",
    },
  });
  const [{ data, error, loading }, switchNetwork] = useNetwork();
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });
  const isConnected = accountData && Object.entries(accountData).length > 0;

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

  useEffect(() => {
    setClaimCardData((prevState) => ({
      ...prevState,
      avatar: accountData?.ens?.avatar || "",
      address: accountData?.ens?.name || maskWalletAddress(accountData?.address),
    }));
  }, [accountData?.address, accountData?.ens]);

  return (
    <Box m="0" w="100vw" h="100vh" background="blue">
      <Head>
        <title>$CODE Claim Page</title>
      </Head>
      <Flex direction="row" flexWrap="wrap">
        {/* {width && height && <Confetti width={width} height={height} />} */}
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
          <MainBox
            isConnected={isConnected}
            isUnsupported={data.chain?.unsupported}
          />
        </Box>
        <Flex
          w={{ base: "100vw", lg: "50vw" }}
          h="100vh"
          m="0"
          backgroundColor="#F1F0F5"
          align="center"
          justifyContent="center"
          bgGradient={"linear(to-b, white, purple.300)"}
        >
          <Box m={["24px", "10vw"]}>
            <ClaimCard data={claimCardData} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Home;
