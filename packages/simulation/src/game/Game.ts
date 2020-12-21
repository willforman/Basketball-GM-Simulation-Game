import { Move, Location } from "../models";

import Player from "../player/Player";
import RandomSelector from "../services/RandomSelector";
import Team from "../team/Team";
import BoxScore from "./BoxScore";
import CourtLocations from "./CourtLocations";

interface Possession {
  resultingPoints: number;
  secondsTaken: number;
}

interface TeamItems {
  starters: Player[];
  boxScores: Map<Player, BoxScore>;
  locations: CourtLocations;
}

const getReboundLocation: () => Location = new RandomSelector<Location>([
  { item: Location.PAINT, weight: 70 },
  { item: Location.MID_RANGE, weight: 20 },
  { item: Location.TOP_KEY, weight: 5 },
  { item: Location.CORNER, weight: 5 },
]).getChoice;

const getRand = (ub: number): number => {
  return Math.floor(Math.random() * ub + 1);
};

// returns true if first rating is larger or equal, false if not
const compareRatings = (rating1: number, rating2: number): boolean => {
  const rand1 = getRand(rating1);
  const rand2 = getRand(rating2);

  return rand1 > rand2;
};

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

  constructor(homeTeam: Team, awayTeam: Team) {
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;

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

    const homeLocs = new CourtLocations(homeRoster.starters);
    const awayLocs = new CourtLocations(awayRoster.starters);

    // creates TeamItems for both teams
    const homeItems: TeamItems = {
      starters: homeRoster.starters,
      boxScores: this.homeBoxScores,
      locations: homeLocs,
    };

    const awayItems: TeamItems = {
      starters: awayRoster.starters,
      boxScores: this.awayBoxScores,
      locations: awayLocs,
    };

    // determines if home starts with ball
    let homeHasBall = Math.floor(Math.random() * 2) == 1;

    for (let quarter = 1; quarter <= 4; quarter++) {
      let secondsLeftInQuarter = this.QUARTER_LENGTH_MINUTES * 60;
      while (secondsLeftInQuarter > 0) {
        const offItems = homeHasBall ? homeItems : awayItems;
        const defItems = homeHasBall ? awayItems : homeItems;

        const possession = this.playPossession(offItems, defItems);
        secondsLeftInQuarter -= possession.secondsTaken;
        if (homeHasBall) {
          this.homeScore += possession.resultingPoints;
        } else {
          this.awayScore += possession.resultingPoints;
        }
        homeHasBall = !homeHasBall;
      }
    }

    this.completed = true;
  }

  private playPossession(
    offItems: TeamItems,
    defItems: TeamItems,
    positionWithBall = 0, // PG will start with ball at start of each possession
    secondsTaken = 0,
    passBonus = 0,
    addAssistToPasser?: () => void
  ): Possession {
    let resultingPoints = 0;

    secondsTaken += Math.floor(Math.random() * 16) + 8;

    // get offense variables needed
    const offPlayer = offItems.starters[positionWithBall];
    const offBoxScore = offItems.boxScores.get(offPlayer);

    if (!offBoxScore) {
      throw new Error(`Couldn't find box score of player: ${offPlayer}`);
    }

    offItems.locations.getNewLocs();
    const offPlayerLoc = offItems.locations.getLocOfPlayer(offPlayer);

    const offMove = offPlayer.getMove(offPlayerLoc);
    const offRating = offPlayer.getOffenseRating(offMove) + passBonus;

    // get defense variables needed
    defItems.locations.getNewLocs();

    const defPlayer =
      offMove === Move.PASS // if move is a pass
        ? defItems.locations.getRandPlayerAtLocation(offPlayerLoc) // player at location of offense
        : defItems.locations.getDefenderFromOffMove(offMove, offPlayerLoc); // player at location of where will shoot

    const defRating = defPlayer ? defPlayer.getDefenseRating(offMove) : -1;

    // offense play wins out
    if (compareRatings(offRating, defRating)) {
      // if ball was passed
      if (offMove === Move.PASS) {
        // picks random position to pass to
        let posPassingto: number;
        do {
          posPassingto = Math.floor(Math.random() * 5);
        } while (posPassingto === positionWithBall); // loops until finds different position from current

        const addAssistToPasser = () => {
          offBoxScore.addAssist();
        };

        // calls new play to be played because ball was passed
        const passResult = this.playPossession(
          offItems,
          defItems,
          posPassingto,
          secondsTaken,
          offRating,
          addAssistToPasser
        );

        // updates current results of this play based on pass
        secondsTaken = passResult.secondsTaken;
        resultingPoints = passResult.resultingPoints;
      }
      // if ball was shot
      else {
        const shotResultPoints = this.checkShot(offMove, offRating);
        offBoxScore.addShot(offMove, shotResultPoints);
        resultingPoints = shotResultPoints;

        // if player was passed to, add assist to passer
        if (addAssistToPasser) {
          addAssistToPasser();
        }
      }
    }
    // if defense rating was higher
    else {
      const defBoxScore = defItems.boxScores.get(defPlayer!);

      if (!defBoxScore) {
        throw new Error(
          `Couldn't find box score of player id: ${defPlayer!.getId()} `
        );
      }
      // if offense tried to pass but defense stole it
      if (offMove === Move.PASS) {
        defBoxScore.addSteal();
      }
      //
      else {
        offBoxScore.addShot(offMove);
        // if defense rating is 20 or more higher, then it's a block and there's no chance for rebounding for offense
        if (defRating - 20 >= offRating) {
          defBoxScore.addBlock();
        } else {
          const rebLoc = getReboundLocation();

          let offRebounder = offItems.locations.getRandPlayerAtLocation(rebLoc);
          let defRebounder = defItems.locations.getRandPlayerAtLocation(rebLoc);

          // if theres not a player from either team at that location,
          // use both teams centers
          if (!offRebounder && !defRebounder) {
            offRebounder = offItems.starters[4];
            defRebounder = defItems.starters[4];
          }

          const offRebRating = offRebounder ? offRebounder.getRebounding() : -1;
          const defRebRating = defRebounder ? defRebounder.getRebounding() : -1;

          // if offense gets rebound
          if (compareRatings(offRebRating, defRebRating)) {
            const rebounderBoxScore = offItems.boxScores.get(offRebounder!);
            rebounderBoxScore!.addRebound();

            // calls new play to be played because ball was rebounded
            const passResult = this.playPossession(
              offItems,
              defItems,
              offRebounder!.getPositionNum(),
              secondsTaken,
              0
            );

            // updates current results of this play based on pass
            secondsTaken = passResult.secondsTaken;
            resultingPoints = passResult.resultingPoints;
          }
          // if defense gets rebound
          else {
            const rebounderBoxScore = defItems.boxScores.get(defRebounder!);
            rebounderBoxScore!.addRebound();
          }
        }
      }
    }

    return {
      resultingPoints,
      secondsTaken,
    };
  }

  private checkShot(shotType: string, rating: number): number {
    switch (shotType) {
      case Move.INSIDE_SHOT:
        return rating > Math.floor(Math.random() * 25) ? 2 : 0;
      case Move.MID_SHOT:
        return rating > Math.floor(Math.random() * 32) ? 2 : 0;
      case Move.THREE_PT_SHOT:
        return rating > Math.floor(Math.random() * 45) ? 3 : 0;
    }
    throw new Error(`Invalid shot type given: ${shotType}`);
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
}
