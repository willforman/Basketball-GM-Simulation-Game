import React, { useEffect } from "react";

import PlayerTable from "../../components/playerTable";
import { ScheduleWeek } from "../../components/schedule";
import { Team } from "@bball/simulation/src";
import { useLeague } from "../../context/league";
import Layout from "../../components/layout";
import { navigate } from "gatsby-link";
import { Grid, GridItem } from "@chakra-ui/layout";
import TeamInfo from "../../components/teamInfo";

const TeamIndex: React.FC<{ team?: Team }> = ({ team }) => {
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
      <Grid templateColumns="repeat(3, 1fr)" gap={4} m={10} rowGap={10}>
        <GridItem>
          <TeamInfo team={team} />
        </GridItem>
        <GridItem colSpan={2}>
          <ScheduleWeek games={team.games.slice(0, 6)} />
        </GridItem>
        <GridItem colSpan={3}>
          <PlayerTable players={team.roster.starters} />
        </GridItem>
      </Grid>
    </Layout>
  );
};

export default TeamIndex;
