import { Player } from "../player/Player";
import { Team } from "../team/Team";
import { BoxScore } from "./BoxScore";
import { simGame } from "./simGame";
import { QUARTER_LENGTH_MINS } from "../models/consts";

export class Game {
  private _homeTeam: Team;
  private _awayTeam: Team;

  private _homeScore: number;
  private _awayScore: number;

  private _homeBoxScores: Map<Player, BoxScore>;
  private _awayBoxScores: Map<Player, BoxScore>;

  private _completed: boolean;
  private _isPlayoffGame: boolean;

  constructor(
    team1: Team,
    team2: Team,
    teamIdx: number,
    isPlayoffGame?: boolean
  ) {
    // if team index is even, first team is home and other is not
    // necessary based on scheduling algorithm so even split of home and
    // away games
    if (teamIdx % 2 === 0) {
      this._homeTeam = team1;
      this._awayTeam = team2;
    } else {
      this._homeTeam = team2;
      this._awayTeam = team1;
    }

    this._homeScore = 0;
    this._awayScore = 0;

    this._completed = false;
    this._isPlayoffGame = isPlayoffGame ?? false;
  }

  sim(): boolean {
    if (this._completed) {
      throw Error("Game already played");
    }

    const result = simGame(this._homeTeam, this._awayTeam, QUARTER_LENGTH_MINS);

    this._homeScore = result.homeScore;
    this._awayScore = result.awayScore;

    this._homeBoxScores = result.homeBoxScores;
    this._awayBoxScores = result.awayBoxScores;

    this._completed = true;

    // don't wanna add wins and losses if it's a playoff game
    if (this._isPlayoffGame) {
      return true;
    }

    if (result.homeScore >= result.awayScore) {
      this._homeTeam.wins = this._homeTeam.wins + 1;
      this._awayTeam.losses = this._awayTeam.losses + 1;
    } else {
      this._homeTeam.losses = this._homeTeam.losses + 1;
      this._awayTeam.wins = this._awayTeam.wins + 1;
    }

    return true;
  }

  get scores(): number[] {
    return [this._homeScore, this._awayScore];
  }

  get boxScores(): BoxScore[] {
    if (!this._completed) {
      throw new Error(`Game hasn't been played yet`);
    }
    const homeBoxScoresArr: BoxScore[] = Array.from(
      this._homeBoxScores.values()
    );
    const awayBoxScoresArr: BoxScore[] = Array.from(
      this._homeBoxScores.values()
    );

    return homeBoxScoresArr.concat(awayBoxScoresArr);
  }

  get boxScoresMap(): Map<Player, BoxScore>[] {
    return [this._homeBoxScores, this._awayBoxScores];
  }

  get title(): string {
    return `${this._homeTeam.abreviation} vs. ${this._awayTeam.abreviation}`;
  }

  get teams(): [Team, Team] {
    return [this._homeTeam, this._awayTeam];
  }

  get winner(): Team {
    if (!this._completed) {
      throw new Error("Game hasn't been finished");
    }

    if (this._homeScore > this._awayScore) {
      return this._homeTeam;
    } else {
      return this._awayTeam;
    }
  }

  isTeamInGame(team: Team): boolean {
    return this._homeTeam === team || this._awayTeam === team;
  }
}
