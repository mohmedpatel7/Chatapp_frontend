import React from "react";
import { Skeleton, Stack } from "@chakra-ui/react";

export default function LoadingScale() {
  return (
    <>
      <Stack>
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
      </Stack>
    </>
  );
}
