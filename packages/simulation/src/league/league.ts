import Team from "../team/Team";
import Player from "../player/Player";
import { LeagueNames } from "../models";

import RegularSeason from "./RegularSeason";
import Playoffs from "./Playoffs";
import FreeAgents from "./FreeAgents";
import Draft from "./Draft";
import Conferences from "./Conferences";

enum State {
  PRESEASON_DRAFT = "preseasonDraft",
  PRESEASON_FREE_AGENCY = "preseasonFreeAgency",
  REGULAR_SEASON = "regularSeason",
  PLAYOFFS = "playoffs",
}

export default class League {
  private _state: State;
  private _year: number;

  //private _teams: Team[];
  private _conferences: Conferences;

  private _regularSeason: RegularSeason;
  private _playoffs: Playoffs;

  private _freeAgents: FreeAgents;
  private _draft: Draft;

  private _playerID: number;

  private _genPlayerName: () => string;
  private _getPlayerId: () => number;

  get START_YEAR(): number {
    return 2021;
  }

  constructor(genPlayerName: () => string, confNames: LeagueNames) {
    this._genPlayerName = genPlayerName;

    this._state = State.REGULAR_SEASON;
    this._year = this.START_YEAR;

    this._playerID = 1;

    this._getPlayerId = () => this._playerID++;

    this._conferences = new Conferences(
      confNames,
      genPlayerName,
      this._getPlayerId
    );

    this._regularSeason = new RegularSeason(this._conferences.allTeams);

    this._freeAgents = new FreeAgents(this._getPlayerId, genPlayerName);
  }

  advToDraft(): void {
    this.advState(State.PLAYOFFS);

    if (!this._playoffs.completed) {
      throw new Error(`Playoffs aren't completed`);
    }

    this._year++;

    this._conferences.advanceYear();
    this._freeAgents.advanceYear();

    this._draft.addPlayoffTeams(this._playoffs.teamsInDraftOrder);
    this._draft.setPicksInOrder();
  }

  advToFreeAgency(): void {
    this.advState(State.PRESEASON_DRAFT);

    if (!this._draft.completed) {
      throw new Error(`Draft isn't completed`);
    }

    this._freeAgents.addPlayers(this._draft.players);

    this._conferences.allTeams.forEach((team: Team) => team.renewFreeAgents());
  }

  advToRegSeason(): void {
    this.advState(State.PRESEASON_FREE_AGENCY);

    this._regularSeason = new RegularSeason(this._conferences.allTeams);
  }

  advToPlayoffs(): void {
    this.advState(State.REGULAR_SEASON);

    if (!this._regularSeason.completed) {
      throw new Error(`Regular season isn't completed`);
    }

    const nonPlayoffTeams = this._conferences.nonPlayoffTeams[0].concat(
      this._conferences.nonPlayoffTeams[1]
    );
    this._playoffs = new Playoffs(this._conferences.playoffTeams);
    this._draft = new Draft(
      this._genPlayerName,
      this._getPlayerId,
      nonPlayoffTeams
    );
  }

  private advState(wantedState: State): void {
    if (wantedState !== this._state) {
      throw new Error(
        `Given state: ${this._state}, Desired state: ${wantedState}`
      );
    }

    this._state = this.getNextState();
  }

  private getNextState(): State {
    switch (this._state) {
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
  get year(): number {
    return this._year;
  }

  get winner(): Team {
    if (!this._playoffs.winner) {
      throw new Error("Playoffs not completed");
    }

    return this._playoffs.winner;
  }

  get regularSeason(): RegularSeason {
    return this._regularSeason;
  }

  get playoffs(): Playoffs {
    return this._playoffs;
  }

  get draft(): Draft {
    return this._draft;
  }

  get freeAgents(): FreeAgents {
    return this._freeAgents;
  }

  get teams(): Team[] {
    return this._conferences.allTeams;
  }
}
