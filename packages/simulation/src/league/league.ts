import Team from "../team/Team";
import { TeamNames } from "../models";
import RegularSeason from "./RegularSeason";
import Playoffs from "./Playoffs";

export default class League {
  private year: number;

  private teams: Team[];

  private regularSeason: RegularSeason;
  private playoffs: Playoffs;

  private playerID: number;

  // class constants
  get LEAGUE_SIZE(): number {
    return 4;
  }

  get START_YEAR(): number {
    return 2021;
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

    this.regularSeason = new RegularSeason(this.teams);
  }

  simulateWeek(): void {
    this.regularSeason.simulateWeek();
  }

  simulateSeason(): void {
    this.regularSeason.simulateAll();
  }

  simulatePlayoffRound(): void {
    this.playoffs.simulateRound();
  }

  simulateAllPlayoffs(): void {
    this.playoffs.simulateAll();
  }

  initPlayoffs(): void {
    this.playoffs = new Playoffs(this.teams);
  }

  advanceYear(): void {
    if (!this.playoffs.getCompleted()) {
      throw new Error("Can't advance, the playoffs haven't been completed");
    }

    this.teams.forEach((team: Team) => team.advanceYear());
    this.year++;
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

  getWinner(): Team {
    if (!this.playoffs.getWinner()) {
      throw new Error("Playoffs not completed");
    }

    return this.playoffs.getWinner();
  }
}
