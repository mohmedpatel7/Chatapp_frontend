import React, { useContext, useState } from "react";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import ChatContext from "../../context/ChatContext";
import LoadingScale from "./LoadingScale";
import UserListItem from "./UserAvtar/UserListItem";

const SlideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]); // Ensure searchResult is always an array
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const navigate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const toast = useToast();
  const { setUserDetails, setSelectedChat, chats, setChats } =
    useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    setUserDetails(null);
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter name to search..!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return; // Exit if search is empty
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://chatapp-backend-3twn.onrender.com/api/User/searchUser/${search}`,
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
      setSearchResult(Array.isArray(data.user) ? data.user : []); // Ensure user array is set correctly
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

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const response = await fetch(
        `https://chatapp-backend-3twn.onrender.com/api/Chat/createChat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-token": localStorage.getItem("user_token"),
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      if (!chats.some((c) => c._id === data._id)) {
        // Changed from find to some
        setChats((prevChats) => [data, ...prevChats]); // Ensure setChats is correctly updating
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false); // Ensure loading state is reset
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  if (!userToken) {
    return null;
  }

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        p="5px 10px"
        borderRadius="15px"
      >
        <Tooltip label="Search User" hasArrow placement="bottom-end">
          <Button variant="ghost" display="flex" alignItems="center" px="4">
            <Box
              as="span"
              mr="2"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <i
                className="fa-solid fa-magnifying-glass"
                style={{ fontSize: "1.2rem", verticalAlign: "middle" }}
                onClick={onOpen}
              ></i>
            </Box>
          </Button>
        </Tooltip>

        <Text fontSize="20px" fontFamily="Arial, Helvetica, sans-serif">
          Nimo Chat
        </Text>

        <Box display="flex" alignItems="center" gap="10px">
          {/* <Menu>
            <MenuButton p={1}>
              <i className="fa-solid fa-bell" style={{ fontSize: "25px" }}></i>
            </MenuButton>
          </Menu> */}

          <Menu>
            <MenuButton p={2}>
              <i className="fa-solid fa-user" style={{ fontSize: "25px" }}></i>
            </MenuButton>
            <MenuList>
              <UserProfile>
                <MenuItem>Profile</MenuItem>
              </UserProfile>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Box>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
            <DrawerBody>
              <Box display="flex" p={2}>
                <Input
                  placeholder="Search by name and email"
                  mr={2}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <Button bg={"#25D366"} color={"#eee"} onClick={handleSearch}>
                  Go
                </Button>
              </Box>
              {loading ? (
                <LoadingScale />
              ) : (
                Array.isArray(searchResult) &&
                searchResult.map((userDetails) => (
                  <UserListItem
                    key={userDetails._id}
                    userDetails={userDetails}
                    handleFun={() => {
                      accessChat(userDetails._id);
                    }}
                  />
                ))
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </div>
  );
};

export default SlideDrawer;
