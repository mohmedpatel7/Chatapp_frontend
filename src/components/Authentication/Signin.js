import { useState } from "react";
import {
  VStack,
  FormControl,
  Input,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const URL = "https://chatapp-backend-urn2.onrender.com";
  //const URL = "http://localhost:5000";

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);

  // This function will toggle the password visibility state
  const handleShow = () => setShow(!show);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setValues({
      ...values,
      [id]: value,
    });
  };

  const toast = useToast();
  let navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${URL}/api/User/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        toast({
          title: "Error",
          description: "Invalid credentials",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
      const data = await response.json();
      if (data && data.user_token) {
        localStorage.setItem("user_token", data.user_token);
        toast({
          title: "Signin Success",
          description: "You have been successfully signed in",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setValues({
          email: "",
          password: "",
        });
        navigate("/chats");
      }
    } catch (error) {
      toast({
        title: "error !",
        description: "Internal server..",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>Email:</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          onChange={handleInputChange}
          value={values.email}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password:</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={handleInputChange}
            value={values.password}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              backgroundColor="#eee"
              onClick={handleShow}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        color="#eee"
        backgroundColor="#25D366"
        _hover={{ color: "#333", backgroundColor: "#eee" }}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => {
          handleSubmit();
        }}
      >
        Sign In
      </Button>
    </VStack>
  );
}
