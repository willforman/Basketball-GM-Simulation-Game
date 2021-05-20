import React from "react";
import Layout from "../components/layout";
import { useLeague } from "../context/league";

const Player: React.FC = () => {
  const { league } = useLeague();
  if (!league) {
    return <Layout>No league</Layout>;
  }

  return <Layout>Player</Layout>;
};

export default Player;
