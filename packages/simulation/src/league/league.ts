import Team from "../team/Team";
import { LeagueNames } from "../models";
import { proposeTrades } from "../team/trade";

import RegularSeason from "./RegularSeason";
import Playoffs from "./Playoffs";
import FreeAgents from "./FreeAgents";
import Draft from "./Draft";
import Conferences from "./Conferences";
import { LeagueState, getNextState } from "./LeagueState";

export default class League {
  private _state: LeagueState;
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

    this._state = LeagueState.REGULAR_SEASON;
    this._year = this.START_YEAR;

    this._playerID = 1;

    this._getPlayerId = () => this._playerID++;

    this._conferences = new Conferences(
      confNames,
      genPlayerName,
      this._getPlayerId
    );

    this._regularSeason = new RegularSeason(this.teams, this.triggerTrades);

    this._freeAgents = new FreeAgents(this._getPlayerId, genPlayerName);
  }

  triggerTrades = (): void => {
    proposeTrades(this.teams);
  };

  advToDraft(): void {
    this._state = getNextState(this._state);

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
    this._state = getNextState(this._state);

    if (!this._draft.completed) {
      throw new Error(`Draft isn't completed`);
    }

    this._freeAgents.addPlayers(this._draft.players);

    this.teams.forEach((team: Team) => team.renewFreeAgents());
  }

  advToRegSeason(): void {
    this._state = getNextState(this._state);

    this._regularSeason = new RegularSeason(this.teams, this.triggerTrades);
  }

  advToPlayoffs(): void {
    this._state = getNextState(this._state);

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
