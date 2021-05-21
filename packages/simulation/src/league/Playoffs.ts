import { Team } from "../team/Team";
import { Game } from "../game/Game";

export const genPlayoffsNextRound = (confs: Team[][]): Round => {
  const confRounds = confs.map((conf: Team[]) => {
    const currConfRound: PlayoffSeries[] = [];

    for (let i = 0; i < conf.length / 2; i++) {
      currConfRound.push(new PlayoffSeries(conf[i], conf[conf.length - i - 1]));
    }

    return new ConfRound(currConfRound);
  });

  return new Round(confRounds);
};

export class Playoffs {
  private _rounds: Round[];
  private _roundIdx: number;
  private _championship: PlayoffSeries;
  private _completed: boolean;
  private _winner: Team;

  constructor(playoffTeams: Team[][]) {
    this._rounds = [];
    this.initNextRound(playoffTeams);
    this._roundIdx = 0;
  }

  initNextRound(teams: Team[][]): void {
    this._rounds.push(genPlayoffsNextRound(teams));
  }

  simRound(): void {
    if (this._completed) {
      throw new Error(
        `Playoffs already completed, roundIdx = ${this._roundIdx}`
      );
    }
    if (this._championship) {
      this._championship.sim();
      this._completed = true;
      this._winner = this._championship.winner;
    } else {
      this.currRound.sim();
      if (!this.currRound.isConfChamp) {
        this.initNextRound(this.currRound.winners);
        this._roundIdx++;
      } else {
        const team1 = this.currRound.winners[0][0];
        const team2 = this.currRound.winners[1][0];
        this._championship = new PlayoffSeries(team1, team2);
      }
    }
  }

  simAll(): void {
    while (!this._completed) {
      this.simRound();
    }
  }

  get winner(): Team {
    if (!this._completed) {
      throw new Error("Can't get winner because playoffs aren't finished");
    }

    return this._winner;
  }

  get completed(): boolean {
    return this._completed;
  }

  get currRound(): Round {
    return this._rounds[this._roundIdx];
  }

  get rounds(): Round[] {
    return this._rounds;
  }

  get teamsInDraftOrder(): Team[] {
    if (!this._completed) {
      throw new Error("Playoffs not complete");
    }

    const teams = this._rounds.reduce(
      (acc: Team[], round: Round) => acc.concat(round.losersInOrder),
      []
    );

    teams.push(this._championship.loser);
    teams.push(this.winner);

    return teams;
  }
}

export class Round {
  private _confRounds: ConfRound[];
  private _completed: boolean;

  constructor(confRounds: ConfRound[]) {
    this._confRounds = confRounds;
    this._completed = false;
  }

  sim(): void {
    if (this._completed) {
      throw new Error("Round has already been completed");
    }
    this._confRounds.forEach((cRound: ConfRound) => cRound.sim());
    this._completed = true;
  }

  get winners(): Team[][] {
    if (!this._completed) {
      throw new Error(`Playoff round is not complete yet`);
    }
    return [this.east.winners, this.west.winners];
  }

  get losersInOrder(): Team[] {
    const eastLosers = this.east.losersInOrder;
    const westLosers = this.west.losersInOrder;

    const losers: Team[] = [];

    for (let i = 0; i < eastLosers.length; i++) {
      const eastFirst = Math.floor(Math.random() * 2) === 1;
      if (eastFirst) {
        losers.push(eastLosers[i], westLosers[i]);
      } else {
        losers.push(westLosers[i], eastLosers[i]);
      }
    }

    return losers;
  }

  get isConfChamp(): boolean {
    return this.east.hasOneSeries;
  }

  get east(): ConfRound {
    return this._confRounds[0];
  }

  get west(): ConfRound {
    return this._confRounds[1];
  }
}

export class ConfRound {
  private _series: PlayoffSeries[];
  private _completed: boolean;

  constructor(series: PlayoffSeries[]) {
    this._series = series;
  }

  sim(): void {
    if (this._completed) {
      throw new Error(`Conf round has already been completed`);
    }
    this._series.forEach((indivSeries: PlayoffSeries) => indivSeries.sim());
    this._completed = true;
  }

  throwErrIfIncomplete(): void {
    if (!this._completed) {
      throw new Error(`Conf round isn't complete yet`);
    }
  }

  get winners(): Team[] {
    this.throwErrIfIncomplete();

    return this._series.map((indivSeries: PlayoffSeries) => indivSeries.winner);
  }

  get hasOneSeries(): boolean {
    return this._series.length === 1;
  }

  get losersInOrder(): Team[] {
    this.throwErrIfIncomplete();

    const teams: Team[] = [];

    if (this.hasOneSeries) {
      return [this._series[0].loser];
    }

    for (let i = 0; i < this._series.length / 2; i++) {
      const loser1 = this._series[i].loser;
      const loser2 = this._series[this._series.length - 1 - i].loser;

      if (i % 2 === 0) {
        teams.push(loser1);
        teams.push(loser2);
      } else {
        teams.push(loser2);
        teams.push(loser1);
      }
    }

    return teams;
  }

  get series(): PlayoffSeries[] {
    return this._series;
  }
}

export class PlayoffSeries {
  private _team1: Team;
  private _team2: Team;

  private _games: Game[];

  private _wins1: number;
  private _wins2: number;

  private _completed: boolean;

  constructor(team1: Team, team2: Team) {
    this._team1 = team1;
    this._team2 = team2;

    this._wins1 = 0;
    this._wins2 = 0;

    this._games = [];
  }

  // team idx will be even if team1 is home, odd if away
  private simGame(teamIdx: number): void {
    const game = new Game(this._team1, this._team2, teamIdx, true);
    this._games.push(game);

    game.sim();

    if (game.winner === this._team1) {
      this._wins1++;
    } else {
      this._wins2++;
    }
  }

  sim(): void {
    if (this._completed) {
      throw new Error("Series already played");
    }

    for (let i = 0; i < 4; i++) {
      this.simGame(Math.floor(i / 2));
    }

    for (let i = 0; this._wins1 < 4 && this._wins2 < 4; i++) {
      this.simGame(i % 2);
    }

    this._completed = true;
  }

  get didTeam1Win(): boolean {
    if (!this._completed) {
      throw new Error(`Series not completed: ${this._wins1} - ${this._wins2}`);
    }
    return this._wins1 === 4;
  }

  get winner(): Team {
    return this.didTeam1Win ? this._team1 : this._team2;
  }

  get loser(): Team {
    return this.didTeam1Win ? this._team2 : this._team1;
  }

  get team1(): Team {
    return this._team1;
  }

  get team2(): Team {
    return this._team2;
  }

  get wins1(): number {
    return this._wins1;
  }

  get wins2(): number {
    return this._wins2;
  }

  // returns odds of team 1 winning
  // based on https://www.billjamesonline.com/the_mathematics_of_the_nba_playoffs/
  calcOdds(): number {
    const { _team1: team1, _team2: team2 } = this;
    const w1 = team1.wins;
    const l1 = team1.losses;

    const w2 = team2.wins;
    const l2 = team2.losses;

    return Math.round((w1 * l2) / (w1 * l2 + w2 * l1));
  }
}
