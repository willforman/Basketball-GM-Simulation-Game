import { Team, MAX_CAP } from "@bball/simulation/src";
import React, { useEffect } from "react";
import Layout from "../../components/layout";
import Roster from "../../components/roster";
import { useLeague } from "../../context/league";
import { navigate } from "gatsby";
import { Box, Text } from "@chakra-ui/layout";

const RosterComp: React.FC<{ team: Team }> = ({ team }) => {
  const { league } = useLeague();

  // if navigated to this page without a league, will go back
  // to create league page
  useEffect(() => {
    if (league == null) {
      navigate("/");
    }
  });

  if (league == null) {
    return <div></div>;
  }

  team = team ?? league.teams[0];
  return (
    <Layout>
      <Box fontWeight="bold">
        <Text>{`Rating: ${team.roster.rating.toFixed(2)}`}</Text>
        <Text>{`Roster space: ${team.roster.allPlayers.length} / 15`}</Text>
        <Text>{`Payroll: $${team.roster.cap.toFixed(
          2
        )} M / $${MAX_CAP} M`}</Text>
      </Box>
      <Roster team={team} showAllPlayers></Roster>
    </Layout>
  );
};

export default RosterComp;
