import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Box, useToast } from "@chakra-ui/react";
import SlideDrawer from "./SlideDrawer";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";
import ChatContext from "../../context/ChatContext";
import io from "socket.io-client";

export default function ChatPage() {
  const [fetchedData, setfetchedData] = useState(false);
  const [message, setMessage] = useState([]);
  const [socketConnection, setsocketConnection] = useState(false);

  const {
    selectedChat,
    setSelectedChat,
    userDetails,
    notification,
    setNotification,
  } = useContext(ChatContext);
  const toast = useToast();

  const ENDPOINT = "https://chatapp-backend-3twn.onrender.com";
  const socketRef = useRef(); // Use a ref to store the socket instance
  const selectedChatCompareRef = useRef(); // Ref to store the previous selected chat

  // Code for connecting frontend to backend socket.io...
  useEffect(() => {
    if (userDetails) {
      socketRef.current = io(ENDPOINT); // Initialize socket connection and store it in ref
      socketRef.current.emit("setup", userDetails.user); // Send user data to backend
      socketRef.current.on("connected", () => {
        setsocketConnection(true);
      });

      // Clean up socket connection on component unmount
      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [userDetails]);

  //For the socket.io message receiving..
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("message received", (newMessage) => {
        console.log("New message received: ", newMessage);

        if (
          !selectedChatCompareRef.current ||
          selectedChatCompareRef.current._id !== newMessage.chat._id
        ) {
          // Check if the message is already in the notifications array
          setNotification((prevNotifications) => {
            const messageAlreadyInNotifications = prevNotifications.some(
              (n) => n._id === newMessage._id
            );

            // Only add the message if it is not already in the notifications array
            if (!messageAlreadyInNotifications) {
              console.log("Adding new message to notifications: ", newMessage);
              return [newMessage, ...prevNotifications];
            }

            return prevNotifications;
          });

          // Optional: Fetch chats again to reflect new message counts
          setfetchedData((prev) => !prev);
        } else {
          // If the message is for the selected chat, append it to the message array
          setMessage((prevMessages) => [...prevMessages, newMessage]);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("message received");
      }
    };
  }, []);

  const fetchMessages = useCallback(
    async (chatId) => {
      if (!chatId) return;

      // Use selectedChatCompareRef to compare previous and current selected chat
      if (selectedChatCompareRef.current !== chatId) {
        try {
          const response = await fetch(
            `https://chatapp-backend-3twn.onrender.com/api/Message/fetchMessage/${chatId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "user-token": localStorage.getItem("user_token"),
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            throw new Error("Failed to fetch messages");
          }

          const data = await response.json();
          setfetchedData(true);
          setMessage(data);

          socketRef.current.emit("join chat", chatId); //Joining room..

          // Store the current chatId in the ref after fetching messages
          selectedChatCompareRef.current = chatId;
        } catch (error) {
          console.error("Error during fetchMessages:", error);
          toast({
            title: "Error",
            description:
              error.message ||
              "Internal server error while fetching messages..! ",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        }
      }
    },
    [toast]
  );

  return (
    <div style={{ width: "100%" }}>
      <SlideDrawer />
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="85.5vh"
        p="10px"
      >
        <Box
          width={{ base: "100%", md: "32%" }}
          borderRadius="lg"
          borderWidth="1px"
        >
          <MyChats
            fetchedData={fetchedData}
            setfetchedData={setfetchedData}
            fetchMessages={fetchMessages}
            setSelectedChat={setSelectedChat}
          />
        </Box>

        <ChatBox
          fetchedData={fetchedData}
          setfetchedData={setfetchedData}
          fetchMessages={fetchMessages}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          message={message}
          setMessage={setMessage}
          selectedChatCompareRef={selectedChatCompareRef}
          socketRef={socketRef}
        />
      </Box>
    </div>
  );
}
