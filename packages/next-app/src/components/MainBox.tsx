import { Button, ButtonType } from "@/components/Button";
import { Wallet } from "@/components/Wallet";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

interface MainBoxProps {
  isConnected: boolean | undefined;
  isUnsupported: boolean | undefined;
}

export const MainBox = ({ isConnected, isUnsupported }: MainBoxProps) => {
  return (
    <Box my={["24px", "0"]} w="100%">
      <Heading
        as="h1"
        color="white"
        fontSize={["44px", "96px"]}
        fontWeight="500"
      >
        Airdrop
      </Heading>
      <Text
        mt="5"
        mb="8"
        color="white"
        fontSize={["20px", "24px"]}
        fontWeight="500"
        fontFamily="Zen Kaku Gothic New"
      >
        $CODE is the new governance token for Developer DAO. Connect your wallet
        to determine your airdrop eligibility.
      </Text>
      <Flex direction={["column", "row"]}>
        <Box mb={["4", "0"]} mr={["0", "7"]} w={["100%", "inherit"]}>
          <Wallet isConnected={isConnected} isUnsupported={isUnsupported} />
        </Box>
        <Button label="LEARN MORE" buttonType={ButtonType.Learn} />
      </Flex>
    </Box>
  );
};
