import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useDisclosure,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import ChatContext from "../../../context/ChatContext";
import UserBadge from "./UserBadge";
import UserListItem from "./UserListItem";

export default function UpdateGroupModal({
  fetchedData,
  setfetchedData,
  fetchMessages,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, userDetails } =
    useContext(ChatContext);

  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleUpdate = async () => {
    if (!groupName) return;

    try {
      const response = await fetch(
        `https://chatapp-backend-urn2.onrender.com/api/Chat/renameGroup`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "user-token": localStorage.getItem("user_token"),
          },
          body: JSON.stringify({
            chatId: selectedChat._id,
            chatName: groupName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Response Error:", data);
        throw new Error(data.message || response.statusText);
      }

      setSelectedChat(data);
      // Check if setfetchedData is passed as a function
      if (typeof setfetchedData === "function") {
        setfetchedData(!fetchedData);
      }
      toast({
        title: "Group name updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error("Update group name error:", error);
      toast({
        title: "Failed to update group name",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://chatapp-backend-urn2.onrender.com/api/User/searchUser/${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-token": localStorage.getItem("user_token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      setSearchResult(Array.isArray(data.user) ? data.user : []);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGroup = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already in the group",
        status: "warning",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Convert _id values to strings before comparing them
    if (String(selectedChat.groupAdmin._id) !== String(userDetails.user._id)) {
      toast({
        title: "Only admin can add someone...!",
        status: "warning",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(
        `https://chatapp-backend-urn2.onrender.com/api/Chat/addUserToGroup`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "user-token": localStorage.getItem("user_token"),
          },
          body: JSON.stringify({
            chatId: selectedChat._id,
            userId: userToAdd._id,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      toast({
        title: "User added to the group",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });

      setSelectedChat(data);
      if (typeof setfetchedData === "function") {
        setfetchedData(!fetchedData);
      }
    } catch (error) {
      toast({
        title: "Failed to add user to the group",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemove = async (userToRemove = userDetails.user) => {
    // Convert _id values to strings before comparing them
    if (
      String(selectedChat.groupAdmin._id) !== String(userDetails.user._id) &&
      userToRemove._id !== userDetails.user._id
    ) {
      toast({
        title: "Only admin can remove someone.",
        status: "warning",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(
        `https://chatapp-backend-urn2.onrender.com/api/Chat/removeUser`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "user-token": localStorage.getItem("user_token"),
          },
          body: JSON.stringify({
            chatId: selectedChat._id,
            userId: userToRemove._id,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      toast({
        title: "User removed from the group",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });

      // Update state
      setSelectedUsers(
        selectedUsers.filter((user) => user._id !== userToRemove._id)
      );
      onClose();
      // If the user is removing themselves, clear the selected chat
      if (userToRemove._id === userDetails.user._id) {
        setSelectedChat(null);
      } else {
        setSelectedChat(data);
      }

      if (typeof setfetchedData === "function") {
        setfetchedData(!fetchedData);
      }
      fetchMessages();
    } catch (error) {
      toast({
        title: "Failed to remove user from the group",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Populate `selectedUsers` with users from `selectedChat` when modal opens
  useEffect(() => {
    if (isOpen && selectedChat) {
      setSelectedUsers(selectedChat.users || []);
    }
  }, [isOpen, selectedChat]);

  return (
    <div>
      <>
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedChat ? selectedChat.chatName : "Group Name"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box display="flex" w="100%" flexWrap="wrap" pb={3}>
                {selectedUsers.map((u) => (
                  <UserBadge
                    key={u._id}
                    userDetails={u}
                    handleFun={() => handleRemove(u)}
                  />
                ))}
              </Box>

              <Box display="flex">
                <FormControl>
                  <Input
                    placeholder="New Group Name"
                    mb={3}
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </FormControl>
                <Button
                  bg="#25D366"
                  color="#eee"
                  onClick={handleUpdate}
                  _hover={"none"}
                  ml={2}
                >
                  Update
                </Button>
              </Box>

              <FormControl>
                <Input
                  placeholder="Search User To Add"
                  mb={1}
                  mt={5}
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>

              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult
                  .slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      userDetails={user}
                      handleFun={() => handleGroup(user)}
                    />
                  ))
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                bg="red"
                color="white"
                _hover="none"
                mr={3}
                onClick={() => handleRemove()} // Leave group
              >
                Leave group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
}
