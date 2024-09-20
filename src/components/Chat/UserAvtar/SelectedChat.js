import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Text,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender } from "../confing/chatLogic";
import { jwtDecode } from "jwt-decode"; // Ensure this is correctly imported
import MessagesUi from "./MessagesUi";
import "../../style/style.css";
// import Lottie from "react-lottie";

export default function SelectedChat({
  fetchMessages,
  selectedChat,
  setSelectedChat,
  message, // Expecting this to be an array of messages
  loading,
  selectedChatCompareRef,
  socketRef,
  setMessage,
  fetchedData, // Unused, consider removing if unnecessary
  setfetchedData, // Unused, consider removing if unnecessary
}) {
  const [newMessage, setNewMessage] = useState("");
  const [loggedUser, setLoggedUser] = useState("");
  const [socketConnection, setsocketConnection] = useState(false); // State for socket..
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false); // To track when the other user is typing

  const toast = useToast();

  useEffect(() => {
    if (selectedChat && selectedChat._id) {
      fetchMessages(selectedChat._id); // Call the prop function to fetch messages
    }

    // Retrieve and set the logged-in user from the token
    const token = localStorage.getItem("user_token");
    if (token) {
      const decoded = jwtDecode(token);
      setLoggedUser(decoded.user._id); // Set the logged-in user's ID
    }
  }, [selectedChat, fetchMessages]);

  useEffect(() => {
    if (socketRef.current) {
      // Listen for typing and stop typing events
      socketRef.current.on("typing", () => setIsTyping(true)); // Show typing indicator
      socketRef.current.on("stop typing", () => setIsTyping(false)); // Hide typing indicator
    }
  }, [socketRef]);

  let typingTimeout = 2000;
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnection) return; // if socket is not connected then return..
    if (!typing) {
      // if not typing, setTyping to true...
      setTyping(true);
      socketRef.current.emit("typing", selectedChat._id); // Emit when the user starts typing...

      // For stopping typing after 2 seconds of no typing...
      let lastTypingTime = new Date().getTime();

      setTimeout(() => {
        let currentTime = new Date().getTime();
        let timeDiff = currentTime - lastTypingTime;

        if (timeDiff >= typingTimeout && typing) {
          socketRef.current.emit("stop typing", selectedChat._id);
          setTyping(false);
        }
      }, typingTimeout);
    }
  };

  const sendMsg = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socketRef.current.emit("stop typing", selectedChat._id); // Emit stop typing when the message is sent
      try {
        const response = await fetch(
          `https://chatapp-backend-3twn.onrender.com/api/Message/doMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "user-token": localStorage.getItem("user_token"),
            },
            body: JSON.stringify({
              content: newMessage,
              chatId: selectedChat._id,
            }),
          }
        );

        if (!response.ok) {
          toast({
            title: "Error",
            description: "Failed to send message",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
          return;
        }

        const data = await response.json();
        setMessage([...message, data]);

        // Emit the new message via the socket
        if (socketRef.current) {
          socketRef.current.emit("sending message", data);
        }

        setNewMessage(""); // Clear the input
        setfetchedData(!fetchedData);
      } catch (error) {
        console.error("Send message error:", error);
        toast({
          title: "Error",
          description: "Internal server error while sending message",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  if (!selectedChat || !selectedChat.users) {
    return (
      <Box display="flex" alignItems="center" h="100%" justifyContent="center">
        <Text fontFamily="Work sans" fontSize="25px" pb={3}>
          Click On User To Start Message
        </Text>
      </Box>
    );
  }

  return (
    <div>
      <Box
        fontSize={{ base: "28px", md: "25px" }}
        px={2}
        pb={3}
        width="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        color="GrayText"
      >
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat("")}
        />

        {!selectedChat.isGroupChat ? (
          <Text>{getSender(loggedUser, selectedChat.users).toUpperCase()}</Text>
        ) : (
          <Text>{selectedChat.chatName.toUpperCase()}</Text>
        )}
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#E8E8E8"
        width={{ base: "410px", md: "990px" }}
        h="75vh"
        borderRadius="lg"
        overflow="hidden"
      >
        {/* Messages container */}
        <Box
          flex="1"
          style={{ overflowY: "scroll", height: "100%" }}
          mb={3}
          className="no-scrollbar"
        >
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="message">
              <MessagesUi message={message} />
            </div>
          )}
        </Box>
        {/* Typing indicator */}
        {istyping && <div>Loading....</div>}

        {/* Input container */}
        <FormControl onKeyDown={sendMsg} isRequired mt={3}>
          <Input
            variant="filled"
            bg="white"
            placeholder="Send Message..."
            onChange={handleTyping}
            value={newMessage}
            border="1px solid"
            width={{ base: "100%", md: "990px" }}
            borderColor="GrayText"
          />
        </FormControl>
      </Box>
    </div>
  );
}
