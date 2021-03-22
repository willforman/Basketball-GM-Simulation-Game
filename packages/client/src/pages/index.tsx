import React, { useState, useEffect } from "react";
import { League, buildLeague, Team, Player } from "@bball/simulation/src";

const Index: React.FC = () => {
  const [league, setLeague] = useState<League>();

  useEffect(() => {
    const leagueAsync = async () => {
      const league = await buildLeague();
      setLeague(league);
    };
    if (!league) {
      leagueAsync();
    }
  });

  if (!league) {
    return (
      <div>
        <h1>League Loaded: no</h1>
      </div>
    );
  } else {
    return (
      <div>
        <h1>League Loaded: yes</h1>
        <ul>
          {league.teams.map((team: Team) => (
            <li
              key={team.id}
            >{`Name = ${team.name}, rating = ${team.roster.rating}`}</li>
          ))}
        </ul>
        <ul>
          {league.teams[0].roster.allPlayers.map((player: Player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
      </div>
    );
  }
};

export default Index;