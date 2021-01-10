import fetchData from "./fetchData";
import { TeamNames } from "../models";

interface TeamNameObj {
  teamId: number;
  abbreviation: string;
  teamName: string;
  simpleName: string;
  location: string;
}

export default async (): Promise<TeamNames[]> => {
  const url =
    "https://raw.githubusercontent.com/bttmly/nba/master/data/teams.json";

  const namesResponse = await fetchData<TeamNameObj[]>(url);

  return namesResponse.payload.map((team: TeamNameObj) => ({
    name: team.simpleName,
    location: team.location,
    abbreviation: team.abbreviation,
  }));
};
