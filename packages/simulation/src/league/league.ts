import Team from "../team/Team";
import { TeamNames, Pick, LEAGUE_SIZE } from "../models";

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

export const getPlayoffTeams = (allTeams: Team[]): [Team[], Team[]] => {
  const sortedTeams = allTeams.sort(
    (a: Team, b: Team): number => a.getWins() - b.getWins()
  );

  let cutOffIdx = 2;
  while (cutOffIdx * 2 < allTeams.length) {
    cutOffIdx *= 2;
  }

  const playoffTeams = sortedTeams.slice(0, cutOffIdx);
  const nonPlayoffTeams = sortedTeams.slice(cutOffIdx, sortedTeams.length);

  return [playoffTeams, nonPlayoffTeams];
};

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

    for (let i = 0; i < LEAGUE_SIZE; i++) {
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

    this.freeAgents = new FreeAgents(this.getPlayerId, genPlayerName);
  }

  simWeek(): void {
    this.regularSeason.simulateWeek();
  }

  simSeason(): void {
    this.regularSeason.simulateAll();
  }

  simPlayoffRound(): void {
    this.playoffs.simulateRound();
  }

  simAllPlayoffs(): void {
    this.playoffs.simulateAll();
  }

  simDraft(): void {
    this.draft.simulate();
  }

  advToDraft(): void {
    this.advState(State.PLAYOFFS);

    if (!this.playoffs.getCompleted()) {
      throw new Error(`Playoffs aren't completed`);
    }

    this.year++;
    this.teams.forEach((team: Team) => team.advanceYear());

    this.freeAgents.advanceYear();

    this.draft.addPlayoffTeams(this.playoffs.getTeamsInDraftOrder());
    this.draft.setPicksInOrder();
  }

  advToFreeAgency(): void {
    this.advState(State.PRESEASON_DRAFT);

    if (!this.draft.getCompleted()) {
      throw new Error(`Draft isn't completed`);
    }

    this.freeAgents.addPlayers(this.draft.getPlayers());
  }

  advToRegSeason(): void {
    this.advState(State.PRESEASON_FREE_AGENCY);

    this.regularSeason = new RegularSeason(this.teams);
  }

  advToPlayoffs(): void {
    this.advState(State.REGULAR_SEASON);

    if (!this.regularSeason.getCompleted()) {
      throw new Error(`Regular season isn't completed`);
    }

    const [playoffTeams, nonPlayoffTeams] = getPlayoffTeams(this.teams);
    this.playoffs = new Playoffs(playoffTeams);
    this.draft = new Draft(
      this.genPlayerName,
      this.getPlayerId,
      nonPlayoffTeams
    );
  }

  private advState(wantedState: State): void {
    if (wantedState !== this.state) {
      throw new Error(
        `Given state: ${this.state}, Desired state: ${wantedState}`
      );
    }

    this.state = this.getNextState();
  }

  private getNextState(): State {
    switch (this.state) {
      case State.PRESEASON_DRAFT:
        return State.PRESEASON_FREE_AGENCY;
      case State.PRESEASON_FREE_AGENCY:
        return State.REGULAR_SEASON;
      case State.REGULAR_SEASON:
        return State.PLAYOFFS;
      case State.PLAYOFFS:
        return State.PRESEASON_DRAFT;
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

  getWinner(): Team {
    if (!this.playoffs.getWinner()) {
      throw new Error("Playoffs not completed");
    }

    return this.playoffs.getWinner();
  }
}
