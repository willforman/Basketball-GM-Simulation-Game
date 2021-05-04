import React from "react";
import {
  VStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";

const SideBarButton = () => {
  return (
    <Button
      _hover={{ backgroundColor: "purple.500" }}
      variant="ghost"
      borderRadius="0"
      width="100%"
    ></Button>
  );
};

type NavGroupProps = {
  overallName: string;
  names: string[];
};

const NavGroup = (props: NavGroupProps) => {
  return (
    <VStack color="white" backgroundColor="purple.600" spacing="0" width="100%">
      <h1>
        <b>{props.overallName}</b>
      </h1>
      <VStack backgroundColor="purple.600" spacing={-2} width="100%">
        {props.names.map((name: string) => (
          <Button
            className="sidebar-button"
            key={name}
            _hover={{ backgroundColor: "purple.500" }}
            variant="ghost"
            borderRadius="0"
            width="100%"
            onClick={() => console.log(`${props.overallName}/${name}`)}
          >
            {name}
          </Button>
        ))}
      </VStack>
    </VStack>
  );
};

type SimButtonProps = {
  actions: string[];
};

const SimButton: React.FC<SimButtonProps> = (props: SimButtonProps) => {
  return (
    <Accordion allowToggle width="100%" borderColor="purple.600" color="white">
      <AccordionItem bg="purple.600">
        <AccordionButton>
          <b>sim</b>
          <AccordionIcon color="white" />
        </AccordionButton>
        <AccordionPanel bg="purple.600" width="100%">
          {props.actions.map((action: string) => (
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
