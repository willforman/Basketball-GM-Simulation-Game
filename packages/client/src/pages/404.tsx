import React from "react";
import { Link as GatsbyLink } from "gatsby";
import { VStack, Text, Link as ChakraLink } from "@chakra-ui/react";

const Page404: React.FC = () => {
  return (
    <VStack fontSize="lg">
      <Text marginTop="10vh">Invalid url entered</Text>
      <ChakraLink as={GatsbyLink} to="/">
        Click here to go to home page
      </ChakraLink>
    </VStack>
  );
};

export default Page404;
