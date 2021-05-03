import React from "react";
import { useLeague } from "../context/league";
import { buildLeague } from "@bball/simulation/src";

interface ConfProps {
  name: string;
}

const ConfStandings: React.FC<ConfProps> = (props: ConfProps) => {
  return (
    <div>
      <h1>{props.name} Standings</h1>
    </div>
  );
};

const Teams: React.FC = () => {
  const leagueContext = useLeague();
  return (
    <div>
      <ConfStandings name="West"></ConfStandings>
      <ConfStandings name="East"></ConfStandings>
      <button
        onClick={async () => {
          const league = await buildLeague();
          console.log(league);
          leagueContext.setLeague(league);
        }}
      >
        Load Teams
      </button>
    </div>
  );
};

export default Teams;
