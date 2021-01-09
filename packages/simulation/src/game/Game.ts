import Player from "../player/Player";
import Team from "../team/Team";
import BoxScore from "./BoxScore";
import CourtLocations from "./CourtLocations";
import playPossession from "./playPossession";

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

    // can't setup rosters and box scores until game starts
    // in case rosters are changed after game is created
    const homeRoster = this.homeTeam.getRoster();
    const awayRoster = this.awayTeam.getRoster();

    const hBSTitle = `Vs ${this.awayTeam.getAbreviation()}`;
    this.homeBoxScores = new Map(
      this.homeTeam
        .getPlayerArray()
        .map((player: Player) => [player, new BoxScore(hBSTitle)])
    );

    const aBSTitle = ` @ ${this.homeTeam.getAbreviation()}`;
    this.awayBoxScores = new Map(
      this.awayTeam
        .getPlayerArray()
        .map((player: Player) => [player, new BoxScore(aBSTitle)])
    );

    const homeStarters = homeRoster.getStartersNonNull();
    const awayStarters = awayRoster.getStartersNonNull();

    const homeLocs = new CourtLocations(homeStarters);
    const awayLocs = new CourtLocations(awayStarters);

    // creates TeamItems for both teams
    const homeItems = {
      starters: homeStarters,
      boxScores: this.homeBoxScores,
      locations: homeLocs,
    };

    const awayItems = {
      starters: awayStarters,
      boxScores: this.awayBoxScores,
      locations: awayLocs,
    };

    // determines if home starts with ball
    let homeHasBall = Math.floor(Math.random() * 2) == 1;

    for (let quarter = 1; quarter <= 4; quarter++) {
      let secondsLeftInQuarter = this.QUARTER_LENGTH_MINUTES * 60;
      let consecPlays = 0;
      while (secondsLeftInQuarter > 0) {
        const offItems = homeHasBall ? homeItems : awayItems;
        const defItems = homeHasBall ? awayItems : homeItems;

        const possession = playPossession(offItems, defItems);
        secondsLeftInQuarter -= possession.secondsTaken;
        if (homeHasBall) {
          this.homeScore += possession.resultingPoints;
        } else {
          this.awayScore += possession.resultingPoints;
        }
        homeHasBall = !homeHasBall;

        consecPlays++;

        if (Math.floor(Math.random() * consecPlays) > 5) {
          homeItems.starters = homeRoster.getSubs();
          awayItems.starters = awayRoster.getSubs();

          homeItems.locations.addPlayers(homeItems.starters);
          awayItems.locations.addPlayers(awayItems.starters);

          consecPlays = 0;
        }
      }
    }

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
    return `${this.homeTeam.getAbreviation()} vs. ${this.awayTeam.getAbreviation()}`;
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
