import fetchData from "./fetchData";
import { TeamNames } from "../models";

interface TeamNameObj {
  teamId: number;
  abbreviation: string;
  teamName: string;
  simpleName: string;
  location: string;
}

export default class TeamNameGenService {
  private names: TeamNames[];
  private currIdx = 0;

  private async init() {
    const url =
      "https://raw.githubusercontent.com/bttmly/nba/master/data/teams.json";

    const namesResponse = await fetchData<TeamNameObj[]>(url);

    this.names = namesResponse.payload.map((team: TeamNameObj) => ({
      name: team.simpleName,
      location: team.location,
      abbreviation: team.abbreviation,
    }));
  }

  static async build(): Promise<TeamNameGenService> {
    const obj = new TeamNameGenService();
    await obj.init();
    return obj;
  }

  getNextName(): TeamNames {
    if (this.currIdx >= this.names.length) {
      throw Error("Exceeding max amount of calls");
    }
    return this.names[this.currIdx++];
  }
}
