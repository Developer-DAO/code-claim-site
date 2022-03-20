import { Button, ButtonType } from "@/components/Button";
import { useConnect, useNetwork } from "wagmi";
import {
  Box,
  Flex,
  Text,
  HStack,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { ErrorToast } from "./toasts/error";

interface WalletProps {
  isConnected: boolean | undefined;
  isUnsupported: boolean | undefined;
}

export const Wallet = ({ isConnected, isUnsupported }: WalletProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const isToastOpen = useRef(false);

  const [{ data: networkData }, switchNetwork] = useNetwork();
  const [{ data: connectData, error: connectError }, connect] = useConnect();

  useEffect(() => {
    if (!isToastOpen.current && connectError) {
      isToastOpen.current = true;
      toast({
        position: "bottom-right",
        render: () => (
          <ErrorToast message={connectError?.message ?? "Failed to connect"} />
        ),
        onCloseComplete: () => (isToastOpen.current = false),
      });
    }
  }, [connectError, toast, isToastOpen]);

  if (isConnected && !isUnsupported) {
    return (
      <Box w="100%" aling="center">
        <Text
          background="rgba(26, 236, 173, 0.15)"
          borderRadius={8}
          color="#1AECAD"
          fontSize={["16px", "18px"]}
          lineHeight={["1.8em", "1.4em"]}
          fontWeight="900"
          height="56px"
          padding={["13px 4rem", "13px 2rem"]}
          w="100%"
          textAlign={"center"}
        >
          WALLET CONNECTED
        </Text>
      </Box>
    );
  } else if (isConnected && isUnsupported) {
    return (
      <div>
        <Button
          onClick={() =>
            switchNetwork ? switchNetwork(networkData?.chains[0].id) : null
          }
          label="SWITCH NETWORK"
          buttonType={ButtonType.Connect}
          width="full"
        />
      </div>
    );
  } else
    return (
      <HStack width="full">
        <Button
          onClick={onOpen}
          label="CONNECT WALLET"
          buttonType={ButtonType.Connect}
          width="full"
        />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay
            bg="rgba(4, 1, 7, 0.6)"
            backdropFilter="auto"
            backdropBlur="10px"
          />
          <ModalContent bg="none">
            <ModalBody>
              <Flex
                align="center"
                justify="center"
                wrap={["wrap-reverse", "nowrap"]}
              >
                {connectData.connectors.map((x) => (
                  <Button
                    key={x.id}
                    onClick={() => {
                      connect(x);
                      onClose();
                    }}
                    label={x.name}
                    buttonType={ButtonType.Connect}
                    w="240px"
                    h="240px"
                  />
                ))}
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </HStack>
    );
};
