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
import { getActionNames, simForState } from "@bball/simulation/src";

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
            to={`/${overallName.toLowerCase()}/${name
              .toLowerCase()
              .replace(" ", "-")}/`}
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

const Simulate: React.FC = () => {
  const { league, setLeague } = useLeague();

  if (!league) {
    return <div>Can't Simulate</div>;
  }

  const actions = getActionNames(league.state);

  return (
    <Accordion allowToggle width="100%" borderColor="bball.main" color="white">
      <AccordionItem bg="bball.main">
        <AccordionButton paddingLeft={0} paddingRight={0}>
          <Center width="100%" bg="bball.main">
            <VStack>
              <Text fontSize="smaller">{`${league.year} ${league.state}`}</Text>
              <Text>Simulate</Text>
            </VStack>
          </Center>
        </AccordionButton>
        <AccordionPanel
          bg="bball.main_light"
          width="100%"
          paddingLeft={0}
          paddingRight={0}
        >
          {actions.map((action: string) => (
            <Button
              key={action}
              _hover={{ backgroundColor: "bball.main_light" }}
              variant="ghost"
              borderRadius="0"
              width="100%"
              onClick={() => {
                simForState(league, action);
              }}
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
      backgroundColor="bball.main"
      spacing={5}
    >
      <Simulate />
      <NavGroup
        overallName={"League"}
        names={["Playoffs", "Free Agents", "Draft"]}
      />
      <NavGroup overallName={"Team"} names={["Roster"]} />
      <ChakraLink href="https://github.com/willforman/Basketball-GM-Simulation-Game">
        <Text>Github</Text>
      </ChakraLink>
    </VStack>
  );
};
