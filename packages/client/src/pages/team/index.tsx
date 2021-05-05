import React, { useEffect } from "react";

import Roster from "../../components/roster";
import Schedule from "../../components/schedule";
import { Team } from "@bball/simulation/src";
import { useLeague } from "../../context/league";
import Layout from "../../components/layout";
import { navigate } from "gatsby-link";

const TeamIndex: React.FC<{ team?: Team }> = ({ team }) => {
  const leagueContext = useLeague();

  // if navigated to this page without a league, will go back
  // to create league page
  useEffect(() => {
    if (leagueContext.league == null) {
      navigate("/");
    }
  });

  if (leagueContext.league == null) {
    return <div></div>;
  }

  team = team ?? leagueContext.league.teams[0];

  return (
    <Layout>
      <Roster team={team} starters={true}></Roster>
      <Schedule team={team} showGames={5}></Schedule>
    </Layout>
  );
};

export default TeamIndex;
