import { Box, Flex, Text, Link } from "@chakra-ui/react";

import { WarningTwoIcon } from "@chakra-ui/icons";

export const ErrorToast = ({
  message,
  link_message,
  link,
}: {
  message: string;
  link_message?: string;
  link?: string;
}) => (
  <Box
    color="#FFFFFF"
    p={2}
    mb={10}
    mr={10}
    bg="#08010D"
    borderRadius="lg"
    border="2px"
    borderColor="#FF0042"
  >
    <Flex align="center" justify="center" my="2">
      <WarningTwoIcon mr="5" color="#FF0042" />
      <Text fontSize="sm">
        {message}
        {link && link_message && <Link href={link}>{link_message}</Link>}
      </Text>
    </Flex>
  </Box>
);
