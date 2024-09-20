import React from "react";
import { Box } from "@chakra-ui/react";
import SelectedChat from "./UserAvtar/SelectedChat";

const ChatBox = ({
  fetchedData,
  setfetchedData,
  fetchMessages,
  selectedChat,
  setSelectedChat,
  message,
  selectedChatCompareRef,
  socketRef,
  setMessage,
}) => {
  const isUser = localStorage.getItem("user_token");
  // console.log("outside:",message)
  return (
    <>
      {isUser && (
        <Box
          display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
          alignItems="center"
          flexDir="column"
          p={3}
          bg="white"
          width={{ base: "100%", md: "%" }}
          height="570px"
          borderRadius="lg"
          borderWidth="1px"
        >
          {
            <>
              <SelectedChat
                fetchedData={fetchedData}
                setfetchedData={setfetchedData}
                fetchMessages={fetchMessages}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                message={message}
                selectedChatCompareRef={selectedChatCompareRef}
                socketRef={socketRef}
                setMessage={setMessage}
              />{" "}
              {/* {console.log("inside:",message)} */}
            </>
          }
        </Box>
      )}
    </>
  );
};

export default ChatBox;
