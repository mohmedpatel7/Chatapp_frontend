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

export default function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // Added state for confirm password
  });
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // For toggling confirm password visibility

  // Toggle the password visibility state
  const handleShow = () => setShow(!show);
  const handleShowConfirm = () => setShowConfirm(!showConfirm); // Toggle for confirm password

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
    if (values.password !== values.confirmPassword) {
      toast({
        title: "Error",
        description: "Password and Confirm password must be same..!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const response = await fetch(`https://chatapp-backend-urn2.onrender.com/api/User/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Invalid User",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      const data = await response.json();
      if (data && data.user_token) {
        localStorage.setItem("token", data.user_token);
        toast({
          title: "Signup Success",
          description:
            "You have successfully signed up please sigin with your email and password again.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setValues({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign up",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>Name:</FormLabel>
        <Input
          type="text"
          placeholder="Enter Your Name"
          onChange={handleInputChange}
          value={values.name}
        />
      </FormControl>
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
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password:</FormLabel>
        <InputGroup>
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Your Password"
            onChange={handleInputChange}
            value={values.confirmPassword}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              backgroundColor="#eee"
              onClick={handleShowConfirm}
            >
              {showConfirm ? "Hide" : "Show"}
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
        Sign Up
      </Button>
    </VStack>
  );
}
