import React, { useState } from "react";
import { League } from "@bball/simulation/src";

export type LeagueContextType = {
  league: League | null;
  setLeague: (league: League) => void;
};

export const LeagueContext = React.createContext<LeagueContextType>({
  league: null,
  setLeague: (givenLeague: League) => givenLeague,
});

export const LeagueProvider: React.FC = ({ children }) => {
  const [league, setLeague] = useState<League | null>(null);

  return (
    <LeagueContext.Provider value={{ league, setLeague }}>
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeague = (): LeagueContextType => {
  const context = React.useContext(LeagueContext);
  if (!context) {
    throw new Error("useLeague must be used within a league provider");
  }
  return context;
};
