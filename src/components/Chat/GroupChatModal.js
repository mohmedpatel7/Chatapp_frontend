import React, { useState, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import ChatContext from "../../context/ChatContext";
import UserListItem from "./UserAvtar/UserListItem";
import UserBadge from "./UserAvtar/UserBadge";

export default function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { userDetails, chats, setChats } = useContext(ChatContext);

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://chatapp-backend-3twn.onrender.com/api/User/searchUser/${query}`,
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

  const handleSubmit = async () => {
    if (!groupName || selectedUsers.length < 2) {
      toast({
        title: "Error",
        description: "Please provide a group name and select at least one user",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://chatapp-backend-3twn.onrender.com/api/Chat/createGroupChat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-token": localStorage.getItem("user_token"),
          },
          body: JSON.stringify({
            name: groupName,
            users: JSON.stringify(selectedUsers.map((user) => user._id)),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      setLoading(false);
      setGroupName("");
      setSelectedUsers([]);
      setChats([data, ...chats]);
      onClose();

      toast({
        title: "Success",
        description: "Group created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to create the group. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        description: "This user is already in the selected users list",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            justifyContent="center"
            display="flex"
          >
            Create Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Group Name"
                mb={3}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Search User To Add"
                mb={1}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadge
                  key={u._id}
                  userDetails={u}
                  handleFun={() => handleDelete(u)}
                />
              ))}
            </Box>

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
              bg="#25D366"
              color="#eee"
              onClick={handleSubmit}
              _hover={"none"}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
