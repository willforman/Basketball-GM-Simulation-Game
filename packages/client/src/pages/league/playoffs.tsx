import React, { useEffect } from "react";
import Layout from "../../components/layout";
import Bracket from "../../components/bracket";
import { Text } from "@chakra-ui/react";
import { useLeague } from "../../context/league";
import { navigate } from "gatsby-link";

const Playoffs: React.FC = () => {
  const { league } = useLeague();

  useEffect(() => {
    if (!league) {
      navigate("/");
    }
  });

  if (!league) {
    return <div></div>;
  }

  if (!league.playoffs) {
    return (
      <Layout>
        <Text>Playoffs not generated yet</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <Bracket playoffs={league.playoffs} />
    </Layout>
  );
};

export default Playoffs;
