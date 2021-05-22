import { navigate } from "gatsby-link";
import React, { useEffect } from "react";
import Layout from "../../components/layout";
import PlayerTable from "../../components/playerTable";
import { useLeague } from "../../context/league";

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
      <PlayerTable players={league.freeAgents.players} />
    </Layout>
  );
};

export default FreeAgents;
