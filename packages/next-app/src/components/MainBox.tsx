import Confetti from "react-confetti";
import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Wallet } from "@/components/Wallet";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

interface MainBoxProps {
  isConnected: boolean;
  isUnsupported: boolean;
}

export const MainBox = ({ isConnected, isUnsupported }: MainBoxProps) => {
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

  return (
    <div>
      <Confetti width={windowSize.width} height={windowSize.height} colors={["#DD95FF"]}/>
      <Box my={["24px", "0"]} w="100%">
        <Heading as="h1" color="white" fontSize={["44px", "96px"]} fontWeight="500">
          Airdrop
        </Heading>
        <Text mt="5" mb="8" color="white" fontSize={["20px", "24px"]} fontWeight="500">
          <span style={{ fontStyle: "italic" }}>$CODE</span> is the new governance token for Developer DAO. Connect your wallet to determine
          your airdrop eligibility.
        </Text>
        <Flex direction={["column", "row"]}>
          <Box mb={["4", "0"]} mr={["0", "7"]} w={["100%", "inherit"]}>
            <Wallet isConnected={isConnected} isUnsupported={isUnsupported} />
          </Box>
          <Button label="LEARN MORE" />
        </Flex>
      </Box>
    </div>
  );
};
