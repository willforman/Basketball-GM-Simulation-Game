import React from "react";
import {
  Button,
  AlertDialog,
  Box,
  Center,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useLeague } from "../context/league";
import { buildLeague } from "@bball/simulation/src";
import { navigate } from "gatsby";

const Index: React.FC<{ leagueErr: boolean }> = ({ leagueErr }) => {
  const leagueContext = useLeague();

  return (
    <Box height="100vh" bg="bball.background" color="white">
      <Center>
        <VStack margin="30vh">
          <Text fontWeight="extrabold" fontSize="5xl">
            Basketball GM
          </Text>
          <Button
            bg="bball.main"
            size="lg"
            onClick={async () => {
              leagueContext.setLeague(await buildLeague());
              navigate("/league/");
            }}
          >
            Create League
          </Button>
        </VStack>
      </Center>
    </Box>
  );
};

export default Index;
