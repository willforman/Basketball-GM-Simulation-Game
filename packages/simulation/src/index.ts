import League from "./league/League";
import PlayerNameGenService from "./services/PlayerNameService";
import getTeamNames from "./services/getTeamNames";

export const buildLeague = async (): Promise<League> => {
  const ng = await PlayerNameGenService.build();
  const teamNames = await getTeamNames();

  const league = new League(ng.getName, teamNames);

  return league;
};

export default League;

export * from "./team/Team";
