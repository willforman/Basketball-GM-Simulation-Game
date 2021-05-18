import React from "react";
import {
  VStack,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Center,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";

import { Link as GatsbyLink } from "gatsby";

const NavGroup: React.FC<{ overallName: string; names: string[] }> = ({
  overallName,
  names,
}) => {
  return (
    <VStack color="white" backgroundColor="purple.600" spacing="0" width="100%">
      <ChakraLink
        as={GatsbyLink}
        to={`/${overallName.toLowerCase()}/`}
        fontWeight="extrabold"
      >
        {overallName}
      </ChakraLink>
      <VStack backgroundColor="purple.600" spacing={-2} width="100%">
        {names.map((name: string) => (
          <ChakraLink
            as={GatsbyLink}
            to={`/${overallName.toLowerCase()}/${name.toLowerCase()}/`}
            key={name}
            fontWeight="medium"
          >
            {name}
          </ChakraLink>
        ))}
      </VStack>
    </VStack>
  );
};

const SimButton: React.FC<{ actions: string[] }> = ({ actions }) => {
  return (
    <Accordion allowToggle width="100%" borderColor="purple.600" color="white">
      <AccordionItem bg="purple.600">
        <AccordionButton paddingLeft={0} paddingRight={0}>
          <Center width="100%" bg="purple.600">
            <b>Simulate</b>
          </Center>
        </AccordionButton>
        <AccordionPanel
          bg="purple.500"
          width="100%"
          paddingLeft={0}
          paddingRight={0}
        >
          {actions.map((action: string) => (
            <Button
              key={action}
              _hover={{ backgroundColor: "purple.500" }}
              variant="ghost"
              borderRadius="0"
              width="100%"
            >
              {action}
            </Button>
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export const SideBar: React.FC = () => {
  return (
    <VStack
      width="100%"
      height="100vh"
      backgroundColor="purple.600"
      spacing={5}
    >
      <SimButton actions={["1 game", "Season"]}></SimButton>
      <NavGroup overallName={"League"} names={["Standings"]}></NavGroup>
      <NavGroup overallName={"Team"} names={["Roster"]}></NavGroup>
      <ChakraLink href="https://github.com/willforman/Basketball-GM-Simulation-Game">
        <Text>Github</Text>
      </ChakraLink>
    </VStack>
  );
};
