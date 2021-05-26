import React from "react";
import Layout from "../components/layout";
import { useLeague } from "../context/league";
import queryString from "query-string";
import { Player } from "@bball/simulation/src";
import { Table } from "@chakra-ui/react";
import StatsTable from "../components/statTable";

const PlayerPage: React.FC<{ location: Location }> = ({ location }) => {
  const idParam = queryString.parse(location.search).id;

  if (typeof idParam !== "string") {
    return <Layout>Non-string player id given</Layout>;
  }

  const id = parseInt(idParam);

  if (id < 0) {
    return <Layout>Can't give negative id</Layout>;
  }

  const { league } = useLeague();
  if (!league) {
    return <Layout>No league</Layout>;
  }

  if (id >= league.players.length) {
    return (
      <Layout>{`Given id exceeds max id in league: ${
        league.players.length - 1
      }`}</Layout>
    );
  }

  const player = league.players[id];

  return (
    <Layout>
      <StatsTable player={player} />
    </Layout>
  );
};

export default PlayerPage;
