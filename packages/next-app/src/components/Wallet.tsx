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
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { ErrorToast } from "./toasts/error";

import { ModalButton, ModalButtonConfig } from "./ModalButton";

const MetaMaskButtonConfig: ModalButtonConfig = {
  id: "MetaMask",
  backgroundColor: "rgba(94, 45, 0, 0.12)",
  highlightColor: "#FF932D",
  icon: "assets/connect-with-metamask.svg",
  iconSize: "116px",
  label: "MetaMask",
};

const WalletConnectButtonConfig: ModalButtonConfig = {
  id: "WalletConnect",
  backgroundColor: "rgba(129, 183, 255, 0.15)",
  highlightColor: "#4C95F7",
  icon: "assets/connect-with-walletconnect.svg",
  iconSize: "84px",
  label: "Wallet Connect",
};

interface WalletProps {
  isConnected: boolean | undefined;
  isUnsupported: boolean | undefined;
}

export const Wallet = ({ isConnected, isUnsupported }: WalletProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isWeb = useBreakpointValue({ base: false, lg: true }) ?? true;

  const toast = useToast();
  const isToastOpen = useRef(false);

  const [{ data: networkData }, switchNetwork] = useNetwork();
  const [{ data: connectData, error: connectError, loading }, connect] =
    useConnect();

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

  const onClickModalButton = (name: string) => {
    const connector = connectData.connectors.filter(
      (connector) => connector.name === name,
    );
    if (connector.length > 0) {
      connect(connector[0]);
      onClose();
    }
  };

  if (isConnected && !isUnsupported) {
    return (
      <Box w="100%" aling="center">
        <Text
          background="rgba(26, 236, 173, 0.15)"
          borderRadius={8}
          color="#1AECAD"
          fontSize={["16px", "18px"]}
          lineHeight={["1.8em", "1.4em"]}
          minWidth="220px"
          fontWeight="900"
          height="56px"
          padding="14px 1rem"
          textAlign={"center"}
          w="100%"
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
          label={loading ? "Connecting..." : "CONNECT WALLET"}
          buttonType={ButtonType.Connect}
          width="full"
        />
        <Modal size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay
            bg="rgba(4, 1, 7, 0.8)"
            backdropFilter="auto"
            backdropBlur="8px"
            w={["100vw", "50vw"]}
          />
          {isWeb && (
            <ModalOverlay
              bg="rgba(4, 1, 7, 0.8)"
              backdropFilter="auto"
              backdropBlur="10px"
              left="50%"
              w="50vw"
            />
          )}
          <ModalContent bg="none" shadow="none">
            <ModalBody>
              <Flex
                align="center"
                justify="center"
                wrap={["wrap-reverse", "nowrap"]}
              >
                <ModalButton
                  config={WalletConnectButtonConfig}
                  onClick={() =>
                    onClickModalButton(WalletConnectButtonConfig.id)
                  }
                />
                <Flex ml={["0", "110px"]} mb={["32px", "0"]}>
                  <ModalButton
                    config={MetaMaskButtonConfig}
                    onClick={() => onClickModalButton(MetaMaskButtonConfig.id)}
                  />
                </Flex>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </HStack>
    );
};
