import League from "./league/league";
import NameGen from "./services/NameGen";
import TeamNamesService from "./services/TeamNamesService";

export const build = async () => {
  const ng = await NameGen.build();
  const teamNames = await TeamNamesService.build();

  const league = new League(ng.getName, teamNames.getNextName);
};
