import React, { useEffect } from "react";
import PlayerTable from "../../components/playerTable";
import Layout from "../../components/layout";
import { useLeague } from "../../context/league";
import { navigate } from "gatsby";

const Draft: React.FC = () => {
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
      <PlayerTable players={league.draft.players} />
    </Layout>
  );
};

export default Draft;
