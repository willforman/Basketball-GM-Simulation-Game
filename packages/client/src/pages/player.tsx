import React from "react";
import { Player } from "@bball/simulation/src";
import Layout from "../components/layout";
import StatSheet from "../components/stats";

const PlayerPage: React.FC<{ player: Player }> = ({ player }) => {
  console.log(player);
  return (
    <Layout>
      <StatSheet player={player}></StatSheet>
    </Layout>
  );
};

export default PlayerPage;
