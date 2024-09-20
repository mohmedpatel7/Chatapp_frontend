import React from "react";
import { Box, Text, Avatar } from "@chakra-ui/react";
import img from "../profile.jpg";

export default function UserListItem({ userDetails, handleFun }) {
  return (
    <div>
      <Box
        onClick={handleFun}
        bg="#E8E8E8"
        _hover={{
          background: "#38B2AC",
          color: "white",
        }}
        w="100%"
        display="flex"
        flexDirection="row" // Avatar and text side by side
        alignItems="center" // Vertically center the avatar and name
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
        {/* Avatar on the left */}
        <Avatar
          size="sm"
          src={userDetails.pic || img}
          name={userDetails.name}
          mr={3} // Adds space to the right of the avatar
          cursor="pointer"
        />

        {/* Box for the text content */}
        <Box textAlign="left">
          <Text fontWeight="bold">
            {userDetails.name}
            <br /> {userDetails.email}{" "}
          </Text>
        </Box>
      </Box>
    </div>
  );
}
