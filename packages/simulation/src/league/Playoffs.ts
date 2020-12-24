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
  private rounds: Round[];
  private roundIdx: number;
  private completed: boolean;
  private winner: Team;

  constructor(playoffTeams: Team[]) {
    this.rounds = [];
    this.initNextRound(playoffTeams);
    this.roundIdx = 0;
  }

  initNextRound(teams: Team[]): void {
    this.rounds.push(genPlayoffsNextRound(teams));
  }

  simulateRound(): void {
    if (this.completed) {
      throw new Error(
        `Playoffs already completed, roundIdx = ${this.roundIdx}`
      );
    }
    const currRound = this.rounds[this.roundIdx];
    currRound.simulate();

    if (!currRound.isChampionshipRound()) {
      this.initNextRound(currRound.getWinners());
      this.roundIdx++;
    } else {
      this.completed = true;
      this.winner = currRound.getWinners()[0];
    }
  }

  simulateAll(): void {
    for (let round = this.roundIdx; round < this.rounds.length; round++) {
      this.simulateRound();
    }
  }

  getWinner(): Team {
    if (!this.completed) {
      throw new Error("Can't get winner because playoffs aren't finished");
    }

    return this.winner;
  }

  getCompleted(): boolean {
    return this.completed;
  }

  getTeamsInDraftOrder(): Team[] {
    if (!this.completed) {
      throw new Error("Playoffs not complete");
    }

    const teams: Team[] = [];

    for (let round = 0; round < this.rounds.length; round++) {
      teams.concat(this.rounds[round].getLosersInOrder());
    }

    teams.push(this.winner);

    return teams;
  }
}

class Round {
  private series: PlayoffSeries[];
  private completed: boolean;

  constructor(series: PlayoffSeries[]) {
    this.series = series;
    this.completed = false;
  }

  simulate(): void {
    if (this.completed) {
      throw new Error("Round has already been completed");
    }
    this.series.forEach((series: PlayoffSeries) => series.simulate());
    this.completed = true;
  }

  getWinners(): Team[] {
    return this.series.map((series: PlayoffSeries) => series.getWinner());
  }

  isChampionshipRound(): boolean {
    return this.series.length === 1;
  }

  getLosersInOrder(): Team[] {
    if (!this.completed) {
      throw new Error("This series is not completed");
    }

    const teams: Team[] = [];

    for (let i = 0; i < this.series.length / 2; i++) {
      const loser1 = this.series[i].getLoser();
      const loser2 = this.series[this.series.length - 1 - i].getLoser();

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
  private team1: Team;
  private team2: Team;

  private games: Game[];

  private wins1: number;
  private wins2: number;

  private completed: boolean;

  constructor(team1: Team, team2: Team) {
    this.team1 = team1;
    this.team2 = team2;

    this.wins1 = 0;
    this.wins2 = 0;

    this.games = [];
  }

  // team idx will be even if team1 is home, odd if away
  private simGame(teamIdx: number): void {
    const game = new Game(this.team1, this.team2, teamIdx);
    this.games.push(game);

    game.simulate();

    if (game.getWinner() === this.team1) {
      this.wins1++;
    } else {
      this.wins2++;
    }
  }

  simulate(): void {
    if (this.completed) {
      throw new Error("Series already played");
    }

    for (let i = 0; i < 4; i++) {
      this.simGame(Math.floor(i / 2));
    }

    for (let i = 0; this.wins1 < 4 && this.wins2 < 4; i++) {
      this.simGame(i % 2);
    }

    this.completed = true;
  }

  getTeam1Won(): boolean {
    if (!this.completed) {
      throw new Error(`Series not completed: ${this.wins1} - ${this.wins2}`);
    }
    return this.wins1 === 4;
  }

  getWinner(): Team {
    return this.getTeam1Won() ? this.team1 : this.team2;
  }

  getLoser(): Team {
    return this.getTeam1Won() ? this.team2 : this.team1;
  }

  // returns odds of team 1 winning
  // based on https://www.billjamesonline.com/the_mathematics_of_the_nba_playoffs/
  calcOdds(): number {
    const { team1, team2 } = this;
    const w1 = team1.getWins();
    const l1 = team1.getLosses();

    const w2 = team2.getWins();
    const l2 = team2.getLosses();

    return Math.round((w1 * l2) / (w1 * l2 + w2 * l1));
  }
}
