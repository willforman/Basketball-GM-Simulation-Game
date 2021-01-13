import fetchData from "./fetchData";
import { LeagueNames, TeamNames, DivNames } from "../models";

interface resType {
  data: TeamNameObj[];
  meta: {
    total_pages: number;
    current_pages: number;
    next_page: number | null;
    per_page: number;
    total_count: number;
  };
}

interface TeamNameObj {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

const makeDivNames = (name: string): DivNames => {
  return {
    teams: [],
    name,
  };
};

const getDivTeams = (name: string, divs: DivNames[]): TeamNames[] => {
  const div = divs.find((div: DivNames) => div.name === name);

  if (!div) {
    throw new Error(`Given invalid div name: ${name}`);
  }

  return div.teams;
};

export default async (): Promise<LeagueNames> => {
  const url = "https://www.balldontlie.io/api/v1/teams";

  const namesResponse = await fetchData<resType>(url);

  const atlantic = makeDivNames("Atlantic");
  const central = makeDivNames("Central");
  const southEast = makeDivNames("Southeast");
  const northWest = makeDivNames("Northwest");
  const pacific = makeDivNames("Pacific");
  const southWest = makeDivNames("Southwest");

  const eastConf = [atlantic, central, southEast];
  const westConf = [northWest, pacific, southWest];

  namesResponse.payload.data.forEach((team: TeamNameObj) => {
    const transformedRes: TeamNames = {
      name: team.name,
      location: team.city,
      abbreviation: team.abbreviation,
    };

    const conf = team.conference === "East" ? eastConf : westConf;
    getDivTeams(team.division, conf).push(transformedRes);
  });

  return {
    east: eastConf,
    west: westConf,
  };
};
