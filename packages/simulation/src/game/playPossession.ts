import { Move, Location } from "../models";
import RandomSelector from "../services/RandomSelector";
import Player from "../player/Player";
import BoxScore from "./BoxScore";
import CourtLocations from "./CourtLocations";

const getReboundLocation: () => Location = new RandomSelector<Location>([
  { item: Location.PAINT, weight: 70 },
  { item: Location.MID_RANGE, weight: 20 },
  { item: Location.TOP_KEY, weight: 5 },
  { item: Location.CORNER, weight: 5 },
]).getChoice;

const checkShot = (shotType: Move, rating: number): number => {
  switch (shotType) {
    case Move.INSIDE_SHOT:
      return rating > Math.floor(Math.random() * 35) ? 2 : 0;
    case Move.MID_SHOT:
      return rating > Math.floor(Math.random() * 45) ? 2 : 0;
    case Move.THREE_PT_SHOT:
      return rating > Math.floor(Math.random() * 50) ? 3 : 0;
  }
  throw new Error(`Invalid shot type given: ${shotType}`);
};

const getRand = (ub: number): number => {
  return Math.floor(Math.random() * ub + 1);
};

// returns true if first rating is larger or equal, false if not
const compareRatings = (rating1: number, rating2: number): boolean => {
  const rand1 = getRand(rating1);
  const rand2 = getRand(rating2);

  return rand1 > rand2;
};

interface Possession {
  resultingPoints: number;
  secondsTaken: number;
}

interface TeamItems {
  starters: Player[];
  boxScores: Map<Player, BoxScore>;
  locations: CourtLocations;
}

const playPossession = (
  offItems: TeamItems,
  defItems: TeamItems,
  offPlayer = offItems.starters[0], // PG will start with ball at start of each possession
  offPlayerLoc = Location.TOP_KEY, // PG starts at the top of the key every time
  secondsTaken = 0,
  passBonus = 0,
  addAssistToPasser?: () => void
): Possession => {
  let resultingPoints = 0;

  secondsTaken += Math.floor(Math.random() * 14) + 6;

  // get offense variables needed
  const offBoxScore = offItems.boxScores.get(offPlayer);

  if (!offBoxScore) {
    throw new Error(`Couldn't find box score of player: ${offPlayer}`);
  }

  offItems.locations.getNewLocs(offPlayer, offPlayerLoc);

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
      } while (posPassingto === offPlayer.getPositionNum()); // loops until finds different position from current

      const playerPassingTo = offItems.starters[posPassingto];
      const locPassingTo = offItems.locations.getLocOfPlayer(playerPassingTo);

      const addAssistToPasser = () => {
        offBoxScore.addAssist();
      };

      // calls new play to be played because ball was passed
      const passResult = playPossession(
        offItems,
        defItems,
        playerPassingTo,
        locPassingTo,
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
      const shotResultPoints = checkShot(offMove, offRating);
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
          const passResult = playPossession(
            offItems,
            defItems,
            offRebounder!,
            offItems.locations.getLocOfPlayer(offRebounder!),
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
};

export default playPossession;
