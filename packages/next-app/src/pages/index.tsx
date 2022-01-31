import type { NextPage } from "next";
import Head from "next/head";
import { Box, Flex, SlideFade } from "@chakra-ui/react";
import { useAccount, useNetwork } from "wagmi";
import { useState, useEffect, useRef } from "react";

import { ClaimCard } from "@/components/ClaimCard";
import { Logo } from "@/components/Logo";
import { MainBox } from "@/components/MainBox";
import Confetti from "react-confetti";

const Home: NextPage = () => {
  const [{ data: networkData, error, loading }, switchNetwork] = useNetwork();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  const isConnected =
    typeof accountData !== "undefined" &&
    Object.entries(accountData).length > 0;

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const confettiRef = useRef() as React.Ref<HTMLCanvasElement>;

  return (
    <div>
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        colors={["#DD95FF"]}
        ref={confettiRef}
        hidden
      />
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
            <MainBox
              isConnected={isConnected}
              isUnsupported={!!networkData.chain?.unsupported}
            />
          </Box>
          <Flex
            w={{ base: "100vw", lg: "50vw" }}
            h="100vh"
            m="0"
            backgroundColor="#F1F0F5"
            align="center"
            justifyContent="center"
          >
            <SlideFade in={isConnected} offsetY="20px">
              <Box m={["24px", "10vw"]}>
                <ClaimCard confettiRef={confettiRef} />
              </Box>
            </SlideFade>
          </Flex>
        </Flex>
      </Box>
    </div>
  );
};

export default Home;
