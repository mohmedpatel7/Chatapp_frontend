import React, { useContext, useEffect, useRef, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  margin,
  sameSender,
  sameUser,
} from "../confing/chatLogic";
import ChatContext from "../../../context/ChatContext";
import { Avatar, Tooltip, useToast } from "@chakra-ui/react";

export default function MessagesUi({ message }) {
  const { userDetails } = useContext(ChatContext);
  const messagesEndRef = useRef(null);

  // Ensure the local state tracks the messages correctly
  const [msgDelete, setmsgDelete] = useState(message);

  const toast = useToast();

  // Update local state when the `message` prop changes
  useEffect(() => {
    setmsgDelete(message); // Sync state with new messages when received
  }, [message]);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgDelete]); // Trigger when `msgDelete` updates

  if (!userDetails || !userDetails.user) {
    return <div>Loading...</div>;
  }

  const handleDeleteMsg = async (msgId) => {
    const confirmDelete = window.confirm("Delete Message?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://chatapp-backend-urn2.onrender.com/api/Message/deleteMessage/${msgId}`,
        {
          method: "DELETE",
          headers: {
            "user-token": localStorage.getItem("user_token"),
          },
        }
      );

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to delete message",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      const data = await response.json();

      // Update the state to remove the deleted message
      setmsgDelete((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== msgId)
      );

      if (data) {
        toast({
          title: "Success",
          description: "Message deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Internal server error",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <ScrollableFeed>
      {msgDelete &&
        msgDelete.map((msg, i) => {
          const sender = msg.sender || {}; // Handle cases where sender might be undefined
          return (
            <div style={{ display: "flex" }} key={msg._id}>
              {(sameSender(msgDelete, i, userDetails.user._id) ||
                isLastMessage(msgDelete, i, userDetails.user._id)) && (
                <Tooltip
                  label={sender.name || "Unknown Sender"} // Handle cases where sender.name might be undefined
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={sender.name || "Unknown Sender"} // Handle cases where sender.name might be undefined
                    src={sender.pic || undefined} // Handle cases where sender.pic might be undefined
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    sender._id === userDetails.user._id
                      ? "#BEE3F8" // Blue for the logged-in user's message
                      : "#B9F5D0" // Green for other users' messages
                  }`,
                  color: "GrayText",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  fontWeight: "bolder",
                  marginLeft: margin(msgDelete, msg, i, userDetails.user._id),
                  marginTop: sameUser(msgDelete, msg, i, userDetails.user._id)
                    ? 3
                    : 10,
                }}
                onDoubleClick={() => handleDeleteMsg(msg._id)}
              >
                {msg.content}
              </span>
            </div>
          );
        })}
      {/* Invisible div to always scroll to */}
      <div ref={messagesEndRef} />
    </ScrollableFeed>
  );
}
