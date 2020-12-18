import { Roster } from "../models";
import Player from "../player/player";
import Team from "../team/Team";
import BoxScore from "./BoxScore";

interface Possession {
  points: number;
  secondsTaken: number;
}

export default class Game {
  private homeTeam: Team;
  private awayTeam: Team;

  private homeScore: number;
  private awayScore: number;

  private completed: boolean;

  private homeRoster: Roster;
  private awayRoster: Roster;

  private homeBoxScores: Map<number, BoxScore>;
  private awayBoxScores: Map<number, BoxScore>;

  // declared constants
  get QUARTER_LENGTH_MINUTES() {
    return 15;
  }

  constructor(homeTeam: Team, awayTeam: Team) {
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;

    this.homeRoster = homeTeam.getRoster();
    this.awayRoster = awayTeam.getRoster();

    this.homeScore = 0;
    this.awayScore = 0;

    this.completed = false;

    const homeBSTitle = `Vs ${this.awayTeam.getAbreviation()}`;
    this.homeBoxScores = new Map(
      homeTeam
        .getPlayerArray()
        .map((player) => [player.getId(), new BoxScore(homeBSTitle)])
    );

    const awayBSTitle = ` @ ${this.awayTeam.getAbreviation()}`;
    this.awayBoxScores = new Map(
      awayTeam
        .getPlayerArray()
        .map((player) => [player.getId(), new BoxScore(awayBSTitle)])
    );
  }

  initBoxScores(
    team: Team,
    boxScores: Map<number, BoxScore>,
    boxScoreTitle: string
  ) {
    boxScores = new Map(
      team
        .getPlayerArray()
        .map((player: Player) => [player.getId(), new BoxScore(boxScoreTitle)])
    );
  }

  simulate() {
    if (this.completed) {
      throw Error("Game already played");
    }
    for (let quarter = 1; quarter <= 4; quarter++) {
      let secondsLeftInQuarter = this.QUARTER_LENGTH_MINUTES * 60;
      while (secondsLeftInQuarter > 0) {}
    }
  }

  playPossession(
    offPlayer: Player,
    defPlayer: Player,
    passBonus: number
  ): Possession {
    // let points = 0;
    // let secondsTaken = 25;
    // // need to put all players in location
    // // need boxscore of offensive player so can record outcome of play
    // const offBS = this.
    // return {
    //   points,
    //   secondsTaken,
    // };
  }
}
