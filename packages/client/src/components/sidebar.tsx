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
import { useLeague } from "../context/league";
import { SimAction, SimActions, getActions } from "@bball/simulation/src";

const NavGroup: React.FC<{ overallName: string; names: string[] }> = ({
  overallName,
  names,
}) => {
  return (
    <VStack color="white" backgroundColor="bball.main" spacing="0" width="100%">
      <ChakraLink
        as={GatsbyLink}
        to={`/${overallName.toLowerCase()}/`}
        fontWeight="extrabold"
      >
        {overallName}
      </ChakraLink>
      <VStack backgroundColor="bball.main" spacing={-2} width="100%">
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

const SimButton: React.FC<{ simActions: SimActions }> = ({ simActions }) => {
  return (
    <Accordion allowToggle width="100%" borderColor="bball.main" color="white">
      <AccordionItem bg="bball.main">
        <AccordionButton paddingLeft={0} paddingRight={0}>
          <Center width="100%" bg="bball.main">
            <b>Simulate</b>
          </Center>
        </AccordionButton>
        <AccordionPanel
          bg="bball.main_light"
          width="100%"
          paddingLeft={0}
          paddingRight={0}
        >
          {simActions.actions.map((action: SimAction) => (
            <Button
              key={action.name}
              _hover={{ backgroundColor: "bball.main_light" }}
              variant="ghost"
              borderRadius="0"
              width="100%"
              onClick={() => {
                action.func();
                if (simActions.isStateComplete()) {
                  simActions.advFunc();
                }
              }}
            >
              {action.name}
            </Button>
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const Simulate: React.FC = () => {
  const { league } = useLeague();

  if (!league) {
    return <div></div>;
  }

  const actions = getActions(league);

  console.log(league);

  return <SimButton simActions={actions} />;
};

export const SideBar: React.FC = () => {
  return (
    <VStack
      width="100%"
      height="100vh"
      backgroundColor="bball.main"
      spacing={5}
    >
      <Simulate />
      <NavGroup overallName={"League"} names={["Playoffs"]} />
      <NavGroup overallName={"Team"} names={["Roster"]} />
      <ChakraLink href="https://github.com/willforman/Basketball-GM-Simulation-Game">
        <Text>Github</Text>
      </ChakraLink>
    </VStack>
  );
};
