import React, { useEffect } from "react";
import Layout from "../components/layout";
import { useLeague } from "../context/league";
import queryString from "query-string";
import { Grid, GridItem, Text } from "@chakra-ui/react";
import { OffTable, DefTable } from "../components/statTable";
import { navigate } from "gatsby";
import BoxScoreTable from "../components/boxScoreTable";

const PlayerPage: React.FC<{ location: Location }> = ({ location }) => {
  const { league } = useLeague();

  useEffect(() => {
    if (!league) {
      navigate("/");
    }
  });

  if (!league) {
    return <Layout>No league</Layout>;
  }

  const idParam = queryString.parse(location.search).id;

  if (typeof idParam !== "string") {
    return <Layout>Non-string player id given</Layout>;
  }

  const id = parseInt(idParam);

  if (id < 0) {
    return <Layout>Can't give negative id</Layout>;
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
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        <GridItem>
          <OffTable player={player} />
        </GridItem>
        <GridItem>
          <DefTable player={player} />
        </GridItem>
        <GridItem colSpan={2}>
          <BoxScoreTable player={player} />
        </GridItem>
      </Grid>
    </Layout>
  );
};

export default PlayerPage;
