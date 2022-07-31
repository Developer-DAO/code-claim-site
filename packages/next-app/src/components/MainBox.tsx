import { Button, ButtonType } from "@/components/Button";
import { Wallet } from "@/components/Wallet";
import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";

interface MainBoxProps {
  isConnected: boolean | undefined;
  isUnsupported: boolean | undefined;
}

export const MainBox = ({ isConnected, isUnsupported }: MainBoxProps) => (
  <Box w="100%" mt="-120px">
    <Heading as="h1" color="white" fontSize={["44px", "96px"]} fontWeight="500">
      Airdrop
    </Heading>
    <Text
      mt={["5vh", "48px"]}
      mb={["7vh", "60px"]}
      lineHeight="40px"
      color="white"
      fontSize={["20px", "24px"]}
      fontWeight="500"
      maxW="2xl"
    >
      $CODE is the new governance token for Developer DAO. Connect your wallet
      to determine your airdrop eligibility.
    </Text>
    <Flex direction={["column", "row"]}>
      <Box mb={["4", "0"]} mr={["0", "6"]} w={["100%", "inherit"]}>
        <Wallet isConnected={isConnected} isUnsupported={isUnsupported} />
      </Box>
      <Link
        href="https://developerdao.notion.site/The-CODE-Token-3c1e14dbc6bd461fa07978bf37d04fd9"
        isExternal
      >
        <Button
          label="LEARN MORE"
          buttonType={ButtonType.Learn}
          w={["100%", "inherit"]}
        />
      </Link>
    </Flex>
  </Box>
);
