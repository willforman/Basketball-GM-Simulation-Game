import React from "react";
import { LeagueProvider } from "./src/context/league";

export const wrapRootElement = ({ element }) => {
  return <LeagueProvider>{element}</LeagueProvider>;
};
