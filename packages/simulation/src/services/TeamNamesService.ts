import fetchData from "./fetchData";
import TeamNames from "../models/TeamNames";

interface nameObj {
  teamId: number;
  abbreviation: string;
  teamName: string;
  simpleName: string;
  location: string;
}

export default class TeamNamesService {
  private names: TeamNames[];
  private currIdx = 0;

  private async init() {
    const url =
      "https://raw.githubusercontent.com/bttmly/nba/master/data/teams.json";

    const teams = await fetchData(url);

    this.names = teams.map((team: nameObj) => ({
      name: team.simpleName,
      location: team.location,
      abbreviation: team.abbreviation,
    }));
  }

  static async build() {
    const obj = new TeamNamesService();
    await obj.init();
    return obj;
  }

  getNextName() {
    if (this.currIdx >= this.names.length) {
      throw Error("Exceeding max amount of calls");
    }
    return this.names[this.currIdx++];
  }
}
