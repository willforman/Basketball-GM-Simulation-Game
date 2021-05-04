import React from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";

import Roster from "../../components/roster";
import { Team } from "@bball/simulation/src";
import { LeagueContext, useLeague } from "../../context/league";
import { Layout } from "../../components/layout";
import { navigate } from "gatsby-link";
import { assertLeague } from "../../util/assertLeague";

const TeamIndex: React.FC<{ team?: Team }> = ({ team }) => {
  const leagueContext = useLeague();

  if (leagueContext.league == null) {
    navigate("/");
    return <div></div>;
  }

  team = team ?? leagueContext.league.teams[0];

  return (
    <Layout>
      <SimpleGrid columns={2} spacing={10}>
        <Roster team={team} starters={true}></Roster>
      </SimpleGrid>
    </Layout>
  );
};

export default TeamIndex;
