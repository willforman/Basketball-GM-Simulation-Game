import { Roster, moves, Choice, locations } from "../models";
import Player from "../player/Player";
import RandomSelector from "../services/RandomSelector";
import Team from "../team/Team";
import BoxScore from "./BoxScore";
import CourtLocations from "./CourtLocations";

interface Possession {
  resultingPoints: number;
  secondsTaken: number;
  timesPassed: number;
}

interface TeamItems {
  offRoster: Roster;
  defRoster: Roster;
  offBoxScores: Map<Player, BoxScore>;
  defBoxScores: Map<Player, BoxScore>;
}

interface OffenseItems {
  offBoxScore: BoxScore;
  offLocs: CourtLocations;
  offPlayerLoc: string;
  offMove: string;
  offRating: number;
}

const getOffItems = (
  offRoster: Roster,
  positionWithBall: number,
  offBoxScores: Map<Player, BoxScore>,
  passBonus: number
): OffenseItems => {
  const offPlayer = getPlayerByPosition(offRoster, positionWithBall);
  const offBoxScore = offBoxScores.get(offPlayer);

  if (!offBoxScore) {
    throw new Error(
      `Couldn't find box score of player id: ${offPlayer.getId()} `
    );
  }

  const offLocs = new CourtLocations(getStartingPlayers(offRoster));

  const offPlayerLoc = offLocs.getLocOfPlayer(offPlayer);

  const offMove = offPlayer.getMove(offPlayerLoc);
  const offRating =
    offPlayer.getOffenseRating(offMove) * offPlayer.getRatingMultiplier() +
    passBonus;

  return {
    offBoxScore,
    offLocs,
    offPlayerLoc,
    offMove,
    offRating,
  };
};

interface DefItems {
  defLocs: CourtLocations;
  defRating: number;
  defPlayer: Player | null;
}

const getDefItems = (
  defRoster: Roster,
  offMove: string,
  offPlayerLoc: string
): DefItems => {
  const defLocs = new CourtLocations(getStartingPlayers(defRoster));

  let defPlayer: Player | null;
  if (offMove === moves[3]) {
    // if move is a pass, get player at same location as passer
    defPlayer = defLocs.getRandPlayerAtLocation(offPlayerLoc);
  } else {
    // if it's a shot, get player at location of shot
    defPlayer = defLocs.getDefenderFromOffMove(offMove);
  }

  const defRating = defPlayer
    ? defPlayer.getDefenseRating(offMove) * defPlayer.getRatingMultiplier()
    : -1;

  return {
    defLocs,
    defRating,
    defPlayer,
  };
};

const getStartingPlayers = (roster: Roster): Player[] => {
  return [roster.PG, roster.SG, roster.SF, roster.PF, roster.C];
};

const getPlayerByPosition = (roster: Roster, pos: number): Player => {
  switch (pos) {
    case 0:
      return roster.PG;
    case 1:
      return roster.SG;
    case 2:
      return roster.SF;
    case 3:
      return roster.PF;
    case 4:
      return roster.C;
  }
  throw new Error(`Given illegal position: ${pos}`);
};

const getReboundLocation = new RandomSelector([
  { item: locations[0], weight: 70 },
  { item: locations[1], weight: 20 },
  { item: locations[2], weight: 5 },
  { item: locations[3], weight: 5 },
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

  private completed: boolean;

  private homeRoster: Roster;
  private awayRoster: Roster;

  private homeBoxScores: Map<Player, BoxScore>;
  private awayBoxScores: Map<Player, BoxScore>;

  // declared constants
  get QUARTER_LENGTH_MINUTES(): number {
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
        .map((player) => [player, new BoxScore(homeBSTitle)])
    );

    const awayBSTitle = ` @ ${this.awayTeam.getAbreviation()}`;
    this.awayBoxScores = new Map(
      awayTeam
        .getPlayerArray()
        .map((player) => [player, new BoxScore(awayBSTitle)])
    );
  }

  private initBoxScores(
    team: Team,
    boxScores: Map<number, BoxScore>,
    boxScoreTitle: string
  ): void {
    boxScores = new Map(
      team
        .getPlayerArray()
        .map((player: Player) => [player.getId(), new BoxScore(boxScoreTitle)])
    );
  }

  simulate(): void {
    if (this.completed) {
      throw Error("Game already played");
    }

    // determines if home starts with ball
    let homeHasBall = Math.floor(Math.random() * 2) == 1;

    for (let quarter = 1; quarter <= 4; quarter++) {
      let secondsLeftInQuarter = this.QUARTER_LENGTH_MINUTES * 60;
      while (secondsLeftInQuarter > 0) {
        const possession = this.playPossession(homeHasBall);
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
    homeHasBall: boolean,
    positionWithBall = 0,
    secondsTaken = 0,
    passBonus = 0,
    timesPassed = 0,
    teamItems?: TeamItems
  ): Possession {
    let resultingPoints = 0;

    secondsTaken += Math.floor(Math.random() * 16) + 8;

    if (!teamItems) {
      teamItems = {
        offRoster: homeHasBall ? this.homeRoster : this.awayRoster,
        defRoster: homeHasBall ? this.awayRoster : this.homeRoster,
        offBoxScores: homeHasBall ? this.homeBoxScores : this.awayBoxScores,
        defBoxScores: homeHasBall ? this.awayBoxScores : this.homeBoxScores,
      };
    }

    const { offRoster, defRoster, offBoxScores, defBoxScores } = teamItems;

    const {
      offBoxScore,
      offLocs,
      offMove,
      offPlayerLoc,
      offRating,
    } = getOffItems(offRoster, positionWithBall, offBoxScores, passBonus);

    const { defLocs, defRating, defPlayer } = getDefItems(
      defRoster,
      offMove,
      offPlayerLoc
    );

    // offense play wins out
    if (compareRatings(offRating, defRating)) {
      // if ball was passed
      if (offMove === moves[3]) {
        // picks random position to pass to
        let posPassingto: number;
        do {
          posPassingto = Math.floor(Math.random() * 5);
        } while (posPassingto === positionWithBall); // loops until finds different position from current

        // calls new play to be played because ball was passed
        const passResult = this.playPossession(
          homeHasBall,
          posPassingto,
          secondsTaken,
          offRating,
          timesPassed + 1,
          teamItems
        );

        // updates current results of this play based on pass
        secondsTaken = passResult.secondsTaken;
        resultingPoints = passResult.resultingPoints;

        const nextPlayerScored = passResult.timesPassed == timesPassed + 1;

        // if next player passed to scores, must add to assists
        if (resultingPoints > 0 && nextPlayerScored) {
          offBoxScore.addAssist();
        }
      }
      // if ball was shot
      else {
        const shotResultPoints = this.checkShot(offMove, offRating);
        offBoxScore.addShot(offMove, shotResultPoints);
        resultingPoints = shotResultPoints;
      }
    }
    // if defense rating was higher
    else {
      const defBoxScore = defBoxScores.get(defPlayer!);

      if (!defBoxScore) {
        throw new Error(
          `Couldn't find box score of player id: ${defPlayer!.getId()} `
        );
      }
      // if offense tried to pass but defense stole it
      if (offMove === moves[3]) {
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

          let offRebounder = offLocs.getRandPlayerAtLocation(rebLoc);
          let defRebounder = defLocs.getRandPlayerAtLocation(rebLoc);

          // if theres not a player from either team at that location,
          // use both teams centers
          if (!offRebounder && !defRebounder) {
            offRebounder = getPlayerByPosition(offRoster, 4);
            defRebounder = getPlayerByPosition(defRoster, 4);
          }

          const offRebRating = offRebounder ? offRebounder.getRebounding() : -1;
          const defRebRating = defRebounder ? defRebounder.getRebounding() : -1;

          // if offense gets rebound
          if (compareRatings(offRebRating, defRebRating)) {
            const rebounderBoxScore = offBoxScores.get(offRebounder!);
            rebounderBoxScore!.addRebound();

            // calls new play to be played because ball was rebounded
            const passResult = this.playPossession(
              homeHasBall,
              offRebounder!.getPositionNum(),
              secondsTaken,
              0,
              timesPassed,
              teamItems
            );

            // updates current results of this play based on pass
            secondsTaken = passResult.secondsTaken;
            resultingPoints = passResult.resultingPoints;
          }
          // if defense gets rebound
          else {
            const rebounderBoxScore = defBoxScores.get(defRebounder!);
            rebounderBoxScore!.addRebound();
          }
        }
      }
    }

    return {
      resultingPoints,
      secondsTaken,
      timesPassed,
    };
  }

  private checkShot(shotType: string, rating: number): number {
    switch (shotType) {
      case moves[0]: // inside shot
        return rating > Math.floor(Math.random() * 25) ? 2 : 0;
      case moves[1]: // midrange shot
        return rating > Math.floor(Math.random() * 32) ? 2 : 0;
      case moves[2]: // 3 point shot
        return rating > Math.floor(Math.random() * 40) ? 3 : 0;
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
}
