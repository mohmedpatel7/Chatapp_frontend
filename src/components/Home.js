import React from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  Tab,
  TabPanel,
  TabPanels,
  TabList,
} from "@chakra-ui/react";
import Signup from "./Authentication/Signup";
import Signin from "./Authentication/Signin";

export default function Home() {
  return (
    <>
      <Container maxW="xl" centerContent>
        <Box
          display="flex"
          justifyContent="center"
          p={3}
          bg={"white"}
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text fontSize="2xl" fontFamily="work-sans" color="#333">
            NIMO CHAT
          </Text>
        </Box>
        <Box
          p={3}
          bg={"white"}
          w="100%"
          m="2px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Tabs variant="soft-rounded">
            <TabList
              display="flex"
              justifyContent="center"
              width="100%"
              mb="1em"
            >
              <Tab width="50%">Sign In</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <>
                  <Signin />
                </>
              </TabPanel>
              <TabPanel>
                <>
                  <Signup />
                </>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
}
