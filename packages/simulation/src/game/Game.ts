import Player from "../player/Player";
import Team from "../team/Team";
import BoxScore from "./BoxScore";
import simGame from "./simGame";

export default class Game {
  private homeTeam: Team;
  private awayTeam: Team;

  private homeScore: number;
  private awayScore: number;

  private homeBoxScores: Map<Player, BoxScore>;
  private awayBoxScores: Map<Player, BoxScore>;

  private completed: boolean;

  // declared constants
  get QUARTER_LENGTH_MINUTES(): number {
    return 15;
  }

  constructor(team1: Team, team2: Team, teamIdx: number) {
    // if team index is even, first team is home and other is not
    // necessary based on scheduling algorithm so even split of home and
    // away games
    if (teamIdx % 2 === 0) {
      this.homeTeam = team1;
      this.awayTeam = team2;
    } else {
      this.homeTeam = team2;
      this.awayTeam = team1;
    }

    this.homeScore = 0;
    this.awayScore = 0;

    this.completed = false;
  }

  simulate(): void {
    if (this.completed) {
      throw Error("Game already played");
    }

    const result = simGame(
      this.homeTeam,
      this.awayTeam,
      this.QUARTER_LENGTH_MINUTES
    );

    this.homeScore = result.homeScore;
    this.awayScore = result.awayScore;

    this.homeBoxScores = result.homeBoxScores;
    this.awayBoxScores = result.awayBoxScores;

    this.completed = true;
  }

  getScores(): number[] {
    return [this.homeScore, this.awayScore];
  }

  getBoxScores(): BoxScore[] {
    const homeBoxScoresArr: BoxScore[] = Array.from(
      this.homeBoxScores.values()
    );
    const awayBoxScoresArr: BoxScore[] = Array.from(
      this.homeBoxScores.values()
    );

    return homeBoxScoresArr.concat(awayBoxScoresArr);
  }

  getBoxScoresMap(): Map<Player, BoxScore>[] {
    return [this.homeBoxScores, this.awayBoxScores];
  }

  getTitle(): string {
    return `${this.homeTeam.abreviation} vs. ${this.awayTeam.abreviation}`;
  }

  getWinner(): Team {
    if (!this.completed) {
      throw new Error("Game hasn't been finished");
    }

    if (this.homeScore > this.awayScore) {
      return this.homeTeam;
    } else {
      return this.awayTeam;
    }
  }
}
