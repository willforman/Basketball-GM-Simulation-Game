import Team from "../team/Team";
import { TeamNames } from "../models";
import RegularSeason from "./RegularSeason";
import Playoffs from "./Playoffs";
import FreeAgents from "./FreeAgents";
import Draft from "./Draft";

enum State {
  PRESEASON_DRAFT = "preseasonDraft",
  PRESEASON_FREE_AGENCY = "preseasonFreeAgency",
  REGULAR_SEASON = "regularSeason",
  PLAYOFFS = "playoffs",
}

export default class League {
  private state: State;
  private year: number;

  private teams: Team[];

  private regularSeason: RegularSeason;
  private playoffs: Playoffs;

  private freeAgents: FreeAgents;
  private draft: Draft;

  private playerID: number;

  private genPlayerName: () => string;
  private getPlayerId: () => number;

  // class constants
  get LEAGUE_SIZE(): number {
    return 8;
  }

  get START_YEAR(): number {
    return 2021;
  }

  get ROSTER_SIZE(): number {
    return 15;
  }

  get START_FREE_AGENTS_NUM(): number {
    return 20;
  }
  // end constants

  constructor(genPlayerName: () => string, genTeamName: () => TeamNames) {
    this.genPlayerName = genPlayerName;

    this.state = State.REGULAR_SEASON;
    this.year = this.START_YEAR;

    this.playerID = 1;

    this.teams = [];

    this.getPlayerId = () => this.playerID++;

    for (let i = 0; i < this.LEAGUE_SIZE; i++) {
      this.teams.push(
        new Team(
          genTeamName(),
          genPlayerName,
          this.getPlayerId,
          this.ROSTER_SIZE,
          this.START_YEAR
        )
      );
    }

    this.regularSeason = new RegularSeason(this.teams);

    this.freeAgents = new FreeAgents(
      this.START_FREE_AGENTS_NUM,
      this.getPlayerId,
      genPlayerName
    );

    this.draft = new Draft(genPlayerName, this.getPlayerId);
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

  advanceToDraft(): void {
    this.year++;
    this.teams.forEach((team: Team) => team.advanceYear());

    this.draft = new Draft(this.genPlayerName, this.getPlayerId);
  }

  advanceToFreeAgency(): void {
    this.freeAgents.addPlayers(this.draft.getPlayers());
  }

  advanceToRegularSeason(): void {
    this.regularSeason = new RegularSeason(this.teams);
  }

  advanceToPlayoffs(): void {
    this.playoffs = new Playoffs(this.teams);
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
