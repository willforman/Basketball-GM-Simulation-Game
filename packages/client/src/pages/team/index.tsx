import React from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";

import Roster from "../../components/roster";
import { Team } from "@bball/simulation/src";
import { useLeague } from "../../context/league";
import { Layout } from "../../components/layout";

const TeamIndex: React.FC<{ team?: Team }> = ({ team }) => {
  // const leagueContext = useLeague();

  // if (!leagueContext.league) {
  //   throw new Error("League is undefined");
  // }
  // team = team ?? leagueContext.league.teams[0];

  return (
    <Layout>
      <Box>Testtt</Box>
      <SimpleGrid columns={2} spacing={10}>
        <Box>Hi</Box>
        <Box>2</Box>
        <Box>3</Box>
      </SimpleGrid>
    </Layout>
  );
};

export default TeamIndex;
