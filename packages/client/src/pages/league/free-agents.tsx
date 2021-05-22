import { navigate } from "gatsby-link";
import React, { useEffect } from "react";
import Layout from "../../components/layout";
import PlayerTable from "../../components/playerTable";
import { useLeague } from "../../context/league";
import { Text } from "@chakra-ui/react";

const FreeAgents: React.FC = () => {
  const { league } = useLeague();

  useEffect(() => {
    if (!league) {
      navigate("/");
    }
  });

  if (!league) {
    return <div></div>;
  }

  return (
    <Layout>
      <Text>{`Number of free agents: ${league.freeAgents.players.length}`}</Text>
      <PlayerTable players={league.freeAgents.players} />
    </Layout>
  );
};

export default FreeAgents;
