import React from "react";
import { Button, AlertDialog } from "@chakra-ui/react";
import { useLeague } from "../context/league";
import { buildLeague } from "@bball/simulation/src";
import { navigate } from "gatsby";

const Index: React.FC<{ leagueErr: boolean }> = ({ leagueErr: boolean }) => {
  const leagueContext = useLeague();

  return (
    <div>
      <Button
        onClick={async () => {
          leagueContext.setLeague(await buildLeague());
          navigate("/league/");
        }}
      >
        Create League
      </Button>
    </div>
  );
};

export default Index;
