import NameGen from "../services/NameGen";
import Team from "../team/Team";

export default class League {
  private year: number;

  private teams: Team[];

  private playerID: number;

  // class constants
  get LEAGUE_SIZE() {
    return 4;
  }

  get START_YEAR() {
    return 2020;
  }

  get ROSTER_SIZE() {
    return 15;
  }
  // end constants

  constructor(genPlayerName: Function, getNextTeamName: Function) {
    this.year = this.START_YEAR;

    this.playerID = 1;

    this.teams = [];

    const getNextID = () => this.playerID++;

    for (let i = 0; i < this.LEAGUE_SIZE; i++) {
      this.teams.push(
        new Team(getNextTeamName(), genPlayerName, getNextID, this.ROSTER_SIZE)
      );
    }
  }
}
