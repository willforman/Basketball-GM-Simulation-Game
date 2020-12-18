import League from "./league/league";
import PlayerNameGenService from "./services/PlayerNameService";
import TeamNameGenService from "./services/TeamNameService";

export const build = async (): Promise<League> => {
  const ng = await PlayerNameGenService.build();
  const teamNames = await TeamNameGenService.build();

  const league = new League(ng.getName, teamNames.getNextName);

  return league;
};
