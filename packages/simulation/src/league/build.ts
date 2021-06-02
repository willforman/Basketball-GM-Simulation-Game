import { getTeamNames } from "../services/getTeamNames";
import { Conferences } from "./Conferences";
import { LeagueState } from "./LeagueState";
import { getNonConfGames } from "./scheduleGames";

export const buildLeague = async () => {
  const state = LeagueState.REGULAR_SEASON;
  const year = 2021;

  const confNames = await getTeamNames();

  const conferences = new Conferences(confNames);
};
