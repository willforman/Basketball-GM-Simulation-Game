import React, { useEffect } from "react";
import Layout from "../../components/layout";
import Bracket from "../../components/bracket";
import { Text } from "@chakra-ui/react";
import { useLeague } from "../../context/league";
import { navigate } from "gatsby-link";

const Playoffs: React.FC = () => {
  const { league } = useLeague();

  if (!league) {
    return <div></div>;
  }

  useEffect(() => {
    if (!league) {
      navigate("/");
    }
  });

  return (
    <Layout>
      <Text>Playoffs</Text>
      <Bracket league={league} />
    </Layout>
  );
};

export default Playoffs;
