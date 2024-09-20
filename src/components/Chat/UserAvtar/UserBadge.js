import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

export default function UserBadge({ userDetails, handleFun }) {
  return (
    <div>
      <Box
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize={12}
        cursor="pointer"
        onClick={handleFun}
        bg="#25D366"
        color="white"
      >
        {userDetails.name}
        <CloseIcon pl={1} />
      </Box>
    </div>
  );
}
