import Team from "../team/Team";
import Game from "../game/Game";

export const genPlayoffsNextRound = (teams: Team[]): Round => {
  const nextRound: PlayoffSeries[] = [];

  for (let i = 0; i < teams.length / 2; i++) {
    nextRound.push(new PlayoffSeries(teams[i], teams[teams.length - i - 1]));
  }

  return new Round(nextRound);
};

export default class Playoffs {
  private _rounds: Round[];
  private _roundIdx: number;
  private _completed: boolean;
  private _winner: Team;

  constructor(playoffTeams: Team[]) {
    this._rounds = [];
    this.initNextRound(playoffTeams);
    this._roundIdx = 0;
  }

  initNextRound(teams: Team[]): void {
    this._rounds.push(genPlayoffsNextRound(teams));
  }

  simRound(): void {
    if (this._completed) {
      throw new Error(
        `Playoffs already completed, roundIdx = ${this._roundIdx}`
      );
    }
    const currRound = this._rounds[this._roundIdx];
    currRound.sim();

    if (!currRound.isChampionshipRound) {
      this.initNextRound(currRound.winners);
      this._roundIdx++;
    } else {
      this._completed = true;
      this._winner = currRound.winners[0];
    }
  }

  simAll(): void {
    for (let round = this._roundIdx; round < this._rounds.length; round++) {
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

  get teamsInDraftOrder(): Team[] {
    if (!this._completed) {
      throw new Error("Playoffs not complete");
    }

    const teams = this._rounds.reduce(
      (acc: Team[], round: Round) => acc.concat(round.losersInOrder),
      []
    );

    teams.push(this.winner);

    return teams;
  }
}

class Round {
  private _series: PlayoffSeries[];
  private _completed: boolean;

  constructor(series: PlayoffSeries[]) {
    this._series = series;
    this._completed = false;
  }

  sim(): void {
    if (this._completed) {
      throw new Error("Round has already been completed");
    }
    this._series.forEach((series: PlayoffSeries) => series.simulate());
    this._completed = true;
  }

  get winners(): Team[] {
    if (!this._completed) {
      throw new Error(`Playoff round is not complete yet`);
    }
    return this._series.map((series: PlayoffSeries) => series.winner);
  }

  get isChampionshipRound(): boolean {
    return this._series.length === 1;
  }

  get losersInOrder(): Team[] {
    if (!this._completed) {
      throw new Error("This series is not completed");
    }

    const teams: Team[] = [];

    if (this._series.length === 1) {
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
}

class PlayoffSeries {
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
    const game = new Game(this._team1, this._team2, teamIdx);
    this._games.push(game);

    game.simulate();

    if (game.getWinner() === this._team1) {
      this._wins1++;
    } else {
      this._wins2++;
    }
  }

  simulate(): void {
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
