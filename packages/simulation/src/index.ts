import { League } from "./league/League";
import { PlayerNameGenService } from "./services/PlayerNameService";
import { getTeamNames } from "./services/getTeamNames";

export const buildLeague = async (): Promise<League> => {
  const ng = await PlayerNameGenService.build();
  const teamNames = await getTeamNames();

  const league = new League(ng.getName, teamNames);

  return league;
};

export * from "./team/Team";
export * from "./league/League";
export * from "./player/Player";
export * from "./game/Game";
export { PlayerNameGenService } from "./services/PlayerNameService";
export { getTeamNames } from "./services/getTeamNames";
export * from "./models/consts";
