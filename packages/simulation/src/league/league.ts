import PlayerNameGenService from "../services/PlayerNameService";
import TeamNameGenService from "../services/TeamNameService";
import Team from "../team/Team";

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

  constructor(
    playerNameGen: PlayerNameGenService,
    teamNameGen: TeamNameGenService
  ) {
    this.year = this.START_YEAR;

    this.playerID = 1;

    this.teams = [];

    const getNextID = () => this.playerID++;

    for (let i = 0; i < this.LEAGUE_SIZE; i++) {
      this.teams.push(
        new Team(
          teamNameGen.getNextName(),
          playerNameGen,
          getNextID,
          this.ROSTER_SIZE
        )
      );
    }
  }

  // get functions
  getYear(): number {
    return this.year;
  }

  getTeamByLocation(locName: string): Team {
    for (const team of this.teams) {
      if (locName === team.getLocation()) {
        return team;
      }
    }
    throw new Error("Team not found, given invalid location");
  }
}
