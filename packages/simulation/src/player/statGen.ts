import RandomSelector from "../services/RandomSelector";
import { Choice, Move, Location, moveArr, Archetype } from "../models";
import Stats from "./Stats";

export interface StatsGen {
  archetype: Archetype;
  stats: Stats;
  getLocation: () => Location;
  getMove: (loc: Location) => Move;
}

interface LocationObj {
  name: Location;
  choice: Choice<Location>;
  getMove: () => Move;
}

const makeLocation = (
  locationName: Location,
  probWeight: number,
  moveProbWeights: number[]
): LocationObj => {
  // turn array of probabilities into array of Choice objs
  const choices = moveProbWeights.map((moveProb: number, i: number) => ({
    item: moveArr[i],
    weight: moveProb,
  }));

  const getMove = new RandomSelector<Move>(choices).getChoice; // function will get move for this location

  // Choice obj for location
  const choice: Choice<Location> = {
    item: locationName,
    weight: probWeight,
  };

  return {
    name: locationName,
    choice,
    getMove,
  };
};

const getRandStatNum = (): number => {
  return Math.floor(Math.random() * 31) - 15;
};

// const getMovesCanDefend = (stats: number[]): Move[] => {
//   const moves: Move[] = [];

//   const insideDef = stats[5];
//   const midDef = stats[6];
//   const longDef = stats[7];

//   if (insideDef >= 50) {
//     moves.push(Move.INSIDE_SHOT);
//   }
//   if (midDef >= 50) {
//     moves.push(Move.MID_SHOT);
//   }
//   if (longDef >= 50) {
//     moves.push(Move.THREE_PT_SHOT);
//   }

//   return moves;
// };

// const getMostLikelyOffenseMove = (locWeights: number[]): Move => {
//   // if player is mostly in paint
//   if (locWeights[0] > locWeights[1] && locWeights[0] > locWeights[2]) {
//     return Move.INSIDE_SHOT;
//   }
//   if (locWeights[1] > locWeights[0] && locWeights[1] > locWeights[2]) {
//     return Move.MID_SHOT;
//   } else {
//     return Move.THREE_PT_SHOT;
//   }
// };

export function getStats(archetypeNum: number, getPot: () => number): StatsGen {
  // stats order:
  // inside shot, 3 pt shot
  // free throw, passing
  // inside defense, 3 pt defense
  // blocking, stealing
  // rebounding
  let archetype: Archetype;
  let stats: Stats;
  let locs: LocationObj[];

  switch (archetypeNum) {
    case 0:
      archetype = Archetype.PLAYMAKER;
      stats = new Stats(
        [20, 40, 65, 85, 15, 35, 75, 85, 20],
        [2, 3, 7],
        getPot
      );
      locs = [
        makeLocation(Location.PAINT, 1, [70, 20, 0, 10]),
        makeLocation(Location.MID_RANGE, 2, [20, 30, 10, 40]),
        makeLocation(Location.TOP_KEY, 80, [1, 4, 5, 90]),
        makeLocation(Location.CORNER, 17, [10, 10, 20, 60]),
      ];
      break;
    case 1:
      archetype = Archetype.SHARPSHOOTER;
      stats = new Stats(
        [15, 85, 85, 50, 15, 50, 85, 40, 15],
        [1, 2, 6],
        getPot
      );
      locs = [
        makeLocation(Location.PAINT, 1, [40, 40, 0, 20]),
        makeLocation(Location.MID_RANGE, 2, [5, 50, 20, 25]),
        makeLocation(Location.TOP_KEY, 70, [2, 3, 25, 70]),
        makeLocation(Location.CORNER, 27, [2, 3, 55, 40]),
      ];
      break;
    case 2:
      archetype = Archetype.SLASHER;
      stats = new Stats(
        [85, 60, 15, 40, 55, 60, 40, 20, 65],
        [0, 5, 8],
        getPot
      );
      locs = [
        makeLocation(Location.PAINT, 40, [85, 10, 0, 5]),
        makeLocation(Location.MID_RANGE, 55, [50, 30, 0, 20]),
        makeLocation(Location.TOP_KEY, 2, [10, 10, 30, 50]),
        makeLocation(Location.CORNER, 3, [10, 10, 20, 60]),
      ];
      break;
    case 3:
      archetype = Archetype.LOCKDOWN;
      stats = new Stats(
        [25, 30, 15, 50, 60, 85, 85, 75, 15],
        [4, 5, 6],
        getPot
      );
      locs = [
        makeLocation(Location.PAINT, 30, [50, 0, 0, 50]),
        makeLocation(Location.MID_RANGE, 40, [10, 10, 0, 80]),
        makeLocation(Location.TOP_KEY, 10, [10, 15, 10, 65]),
        makeLocation(Location.CORNER, 20, [10, 10, 10, 70]),
      ];
      break;
    case 4:
      archetype = Archetype.STRETCH_BIG;
      stats = new Stats(
        [65, 65, 65, 25, 60, 45, 30, 15, 70],
        [1, 2, 3],
        getPot
      );
      locs = [
        makeLocation(Location.PAINT, 55, [85, 10, 0, 5]),
        makeLocation(Location.MID_RANGE, 10, [25, 45, 10, 20]),
        makeLocation(Location.TOP_KEY, 33, [5, 10, 55, 30]),
        makeLocation(Location.CORNER, 2, [5, 10, 50, 35]),
      ];
      break;
    case 5:
      archetype = Archetype.REBOUNDER;
      stats = new Stats(
        [70, 25, 15, 45, 85, 60, 40, 15, 85],
        [0, 4, 8],
        getPot
      );
      locs = [
        makeLocation(Location.PAINT, 97, [90, 0, 0, 10]),
        makeLocation(Location.MID_RANGE, 3, [50, 30, 0, 20]),
        makeLocation(Location.TOP_KEY, 0, [10, 10, 10, 70]),
        makeLocation(Location.CORNER, 0, [10, 10, 10, 70]),
      ];
      break;
    default:
      throw new Error("Invalid archetype given");
  }

  // getLocation function
  const choices = locs.map((loc: LocationObj) => loc.choice);

  const getLocation = new RandomSelector<Location>(choices).getChoice;

  // getMove function
  const getMove = (locName: Location): Move => {
    const sameLoc = locs.find((loc: LocationObj) => loc.name === locName);

    if (!sameLoc) {
      throw new Error(`Couldn't find location: ${locName}`);
    }

    return sameLoc.getMove();
  };

  return {
    archetype,
    stats,
    getLocation,
    getMove,
  };
}
