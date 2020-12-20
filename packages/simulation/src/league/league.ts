import Team from "../team/Team";
import { TeamNames } from "../models";

export default class League {
  private year: number;

  private teams: Team[];

  private playerID: number;

  // class constants
  get LEAGUE_SIZE(): number {
    return 4;
  }

  get START_YEAR(): number {
    return 2020;
  }

  get ROSTER_SIZE(): number {
    return 15;
  }
  // end constants

  constructor(genPlayerName: () => string, genTeamName: () => TeamNames) {
    this.year = this.START_YEAR;

    this.playerID = 1;

    this.teams = [];

    const getNextID = () => this.playerID++;

    for (let i = 0; i < this.LEAGUE_SIZE; i++) {
      this.teams.push(
        new Team(genTeamName(), genPlayerName, getNextID, this.ROSTER_SIZE)
      );
    }
  }

  // get functions
  getYear(): number {
    return this.year;
  }

  getTeamByLocation(locName: string): Team {
    const foundTeam = this.teams.find(
      (team: Team) => locName === team.getLocation()
    );

    if (!foundTeam) {
      throw new Error(`Team not found, location ${locName} is invalid`);
    }

    return foundTeam;
  }
}
