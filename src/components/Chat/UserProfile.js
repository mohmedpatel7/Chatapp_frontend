import React, { useContext, useEffect } from "react";
import {
  IconButton,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Image,
  Text,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import ChatContext from "../../context/ChatContext";
import img from "./profile.jpg";

export default function UserProfile({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userDetails, loading, fetchData } = useContext(ChatContext);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!userDetails) {
    return <div>No user details available.</div>;
  }

  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {userDetails.user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={userDetails.user.pic || img}
              alt={userDetails.user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              {userDetails.user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" bg="teal" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
