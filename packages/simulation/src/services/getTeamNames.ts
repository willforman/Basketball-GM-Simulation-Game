import fetchData from "./fetchData";
import { ConfNames, TeamNames } from "../models";

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

export default async (): Promise<ConfNames> => {
  const url = "https://www.balldontlie.io/api/v1/teams";

  const namesResponse = await fetchData<resType>(url);

  const eastTeams: TeamNames[] = [];
  const westTeams: TeamNames[] = [];

  namesResponse.payload.data.forEach((team: TeamNameObj) => {
    const transformedRes: TeamNames = {
      name: team.name,
      location: team.city,
      abbreviation: team.abbreviation,
    };

    const confArr = team.conference === "East" ? eastTeams : westTeams;
    confArr.push(transformedRes);
  });

  return {
    east: eastTeams,
    west: westTeams,
  };
};
