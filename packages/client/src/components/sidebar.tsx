import React from "react";
import {
  VStack,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Center,
} from "@chakra-ui/react";

const SideBarButton: React.FC<{ onClick: () => void; text: string }> = ({
  onClick,
  text,
}) => {
  console.log(text);
  return (
    <Button
      _hover={{ backgroundColor: "purple.500" }}
      variant="ghost"
      borderRadius="0"
      width="100%"
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

const NavGroup: React.FC<{ overallName: string; names: string[] }> = ({
  overallName,
  names,
}) => {
  return (
    <VStack color="white" backgroundColor="purple.600" spacing="0" width="100%">
      <h1>
        <b>{overallName}</b>
      </h1>
      <VStack backgroundColor="purple.600" spacing={-2} width="100%">
        {names.map((name: string) => (
          <SideBarButton
            onClick={() => console.log(`${overallName.toLowerCase()}/${name}`)}
            key={name}
            text={name}
          ></SideBarButton>
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
            <b>sim</b>
          </Center>
        </AccordionButton>
        <AccordionPanel
          bg="purple.600"
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
    <VStack width="140px" backgroundColor="purple.600" spacing={5}>
      <SimButton actions={["1 game", "season"]}></SimButton>
      <NavGroup
        overallName={"LEAGUE"}
        names={["standings", "playoffs"]}
      ></NavGroup>
      <NavGroup overallName={"TEAM"} names={["roster", "schedule"]}></NavGroup>
    </VStack>
  );
};
