import React, { useState, useEffect } from "react";
import ChatContext from "./ChatContext"; // Import your existing ChatContext

const Chat = (props) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://chatapp-backend-3twn.onrender.com/api/User/userDetails`,
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
      setUserDetails(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userDetails,
        loading,
        setUserDetails,
        fetchData,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export default Chat;
