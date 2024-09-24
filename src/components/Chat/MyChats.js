import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import ChatContext from "../../context/ChatContext";
import GroupChatModal from "./GroupChatModal";
import LoadingScale from "./LoadingScale";
import { getSender, getSenderFull } from "./confing/chatLogic";
import OtherUserProfile from "./OtherUserProfile";
import { jwtDecode } from "jwt-decode";
import UpdateGroupmodal from "./UserAvtar/UpdateGroupmodal";

const MyChats = ({ fetchedData, setfetchedData, fetchMessages }) => {
  const URL = "https://chatapp-backend-urn2.onrender.com";
  //const URL = "http://localhost:5000";

  const [loggedUser, setLoggedUser] = useState();
  const [openedChats, setOpenedChats] = useState([]); // Track opened chats
  const { selectedChat, setSelectedChat, chats, setChats } =
    useContext(ChatContext);
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      const decoded = jwtDecode(token); // Decode token to get logged-in user details
      setLoggedUser(decoded.user._id); // Set the logged-in user details
    }
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch(`${URL}/api/Chat/fetchChats`, {
        method: "GET",
        headers: {
          "user-token": localStorage.getItem("user_token"),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch chats");
      }

      const data = await response.json();
      setChats(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const deleteChat = async (chatId) => {
    let a = window.confirm("Are you sure ?");
    if (!a) return;

    try {
      const response = await fetch(`${URL}/api/Chat/deleteChat/${chatId}`, {
        method: "DELETE",
        headers: {
          "user-token": localStorage.getItem("user_token"),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete chat");
      }

      // Update local state to remove the deleted chat
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));

      toast({
        title: "Chat Deleted",
        description: "The chat has been successfully deleted.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleClickChat = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);

    // Mark chat as opened (only on first open)
    if (!openedChats.includes(chat._id)) {
      setOpenedChats([...openedChats, chat._id]);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchedData]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      height={{ base: "90vh" }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize={{ base: "28px", md: "25px" }} mr={10} color="GrayText">
          Chats
        </Text>

        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            mr={5}
            rightIcon={<AddIcon />}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        height={{ base: "90vh", md: "490px" }}
        borderRadius="lg"
        overflow="hidden"
        overflowY="scroll"
        css={{
          "&::-webkit-scrollbar": {
            display: "none", // Hide scrollbar in webkit browsers
          },
          scrollbarWidth: "none", // Hide scrollbar in Firefox
        }}
      >
        {chats ? (
          <Stack>
            {chats.map(
              (chat) =>
                chat &&
                chat._id && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    onClick={() => handleClickChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "#25D366" : "#eee"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    {/* Row for Chat Name, Delete Button, and Profile Button */}
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text flex="1">
                        {!chat.isGroupChat && chat.users
                          ? getSender(loggedUser, chat.users) // Correctly get the opposite user's name
                          : chat.chatName}
                      </Text>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          aria-label="Delete chat"
                          icon={<DeleteIcon />}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the onClick of the parent Box
                            deleteChat(chat._id);
                          }}
                          size="sm"
                          colorScheme="red"
                          mr={2} // Space between delete button and profile
                        />
                        {!chat.isGroupChat && chat.users ? (
                          <OtherUserProfile
                            user={getSenderFull(loggedUser, chat.users)}
                          />
                        ) : (
                          <UpdateGroupmodal
                            fetchedData={fetchedData}
                            setfetchedData={setfetchedData}
                            fetchMessages={fetchMessages}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Display latest message only if chat is not selected and it's the first time viewing */}
                    {!openedChats.includes(chat._id) && chat.latestMessage && (
                      <Box>
                        <Text
                          noOfLines={1}
                          fontSize="small"
                          color="black"
                          fontFamily="sans-serif"
                        >
                          <b>{chat.latestMessage.sender.name}:</b>
                          {chat.latestMessage.content}
                        </Text>
                      </Box>
                    )}
                  </Box>
                )
            )}
          </Stack>
        ) : (
          <LoadingScale />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
