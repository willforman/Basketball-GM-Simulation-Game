import { RandomSelector } from "../services/RandomSelector";
import {
  Choice,
  Move,
  Location,
  moveArr,
  Archetype,
  Contract,
} from "../models";
import { Stats } from "./Stats";
import { getRand } from "../services/funcs";

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

export const getArchetype = (archetypeNum: number): Archetype => {
  switch (archetypeNum) {
    case 0:
      return Archetype.PLAYMAKER;
    case 1:
      return Archetype.SHARPSHOOTER;
    case 2:
      return Archetype.SLASHER;
    case 3:
      return Archetype.LOCKDOWN;
    case 4:
      return Archetype.STRETCH_BIG;
    case 5:
      return Archetype.REBOUNDER;
    default:
      throw new Error(`Given invalid archetype num: ${archetypeNum}`);
  }
};

export const getStatsNums = (archetype: Archetype): number[] => {
  switch (archetype) {
    case Archetype.PLAYMAKER:
      return [20, 40, 65, 85, 15, 35, 75, 85, 20];
    case Archetype.SHARPSHOOTER:
      return [15, 85, 85, 50, 15, 50, 85, 40, 15];
    case Archetype.SLASHER:
      return [85, 60, 15, 40, 55, 60, 40, 20, 65];
    case Archetype.LOCKDOWN:
      return [25, 30, 15, 50, 60, 85, 85, 75, 15];
    case Archetype.STRETCH_BIG:
      return [65, 65, 65, 25, 60, 45, 30, 15, 70];
    case Archetype.REBOUNDER:
      return [70, 25, 15, 45, 85, 60, 40, 15, 85];
  }
};

export const getPrimaryIdxs = (archetype: Archetype): number[] => {
  switch (archetype) {
    case Archetype.PLAYMAKER:
      return [2, 3, 7];
    case Archetype.SHARPSHOOTER:
      return [1, 2, 6];
    case Archetype.SLASHER:
      return [0, 5, 8];
    case Archetype.LOCKDOWN:
      return [4, 5, 6];
    case Archetype.STRETCH_BIG:
      return [1, 2, 3];
    case Archetype.REBOUNDER:
      return [0, 4, 8];
  }
};

export const getLocs = (archetype: Archetype): LocationObj[] => {
  switch (archetype) {
    case Archetype.PLAYMAKER:
      return [
        makeLocation(Location.PAINT, 1, [70, 20, 0, 10]),
        makeLocation(Location.MID_RANGE, 2, [20, 30, 10, 40]),
        makeLocation(Location.TOP_KEY, 80, [1, 4, 5, 90]),
        makeLocation(Location.CORNER, 17, [10, 10, 20, 60]),
      ];
    case Archetype.SHARPSHOOTER:
      return [
        makeLocation(Location.PAINT, 1, [40, 40, 0, 20]),
        makeLocation(Location.MID_RANGE, 2, [5, 50, 20, 25]),
        makeLocation(Location.TOP_KEY, 70, [2, 3, 25, 70]),
        makeLocation(Location.CORNER, 27, [2, 3, 55, 40]),
      ];
    case Archetype.SLASHER:
      return [
        makeLocation(Location.PAINT, 40, [85, 10, 0, 5]),
        makeLocation(Location.MID_RANGE, 55, [50, 30, 0, 20]),
        makeLocation(Location.TOP_KEY, 2, [10, 10, 30, 50]),
        makeLocation(Location.CORNER, 3, [10, 10, 20, 60]),
      ];
    case Archetype.LOCKDOWN:
      return [
        makeLocation(Location.PAINT, 30, [50, 0, 0, 50]),
        makeLocation(Location.MID_RANGE, 40, [10, 10, 0, 80]),
        makeLocation(Location.TOP_KEY, 10, [10, 15, 10, 65]),
        makeLocation(Location.CORNER, 20, [10, 10, 10, 70]),
      ];
    case Archetype.STRETCH_BIG:
      return [
        makeLocation(Location.PAINT, 55, [85, 10, 0, 5]),
        makeLocation(Location.MID_RANGE, 10, [25, 45, 10, 20]),
        makeLocation(Location.TOP_KEY, 33, [5, 10, 55, 30]),
        makeLocation(Location.CORNER, 2, [5, 10, 50, 35]),
      ];
    case Archetype.REBOUNDER:
      return [
        makeLocation(Location.PAINT, 97, [90, 0, 0, 10]),
        makeLocation(Location.MID_RANGE, 3, [50, 30, 0, 20]),
        makeLocation(Location.TOP_KEY, 0, [10, 10, 10, 70]),
        makeLocation(Location.CORNER, 0, [10, 10, 10, 70]),
      ];
  }
};

const getAgeBoolean = (age: number): number => {
  return age <= 33 ? 1 : 0;
};

export const calcPotential = (age: number): number => {
  const ageBoolean = getAgeBoolean(age);
  return 40 + getRand(0, 25) + getRand(0, ((33 - age) * 3 - 12) * ageBoolean);
};

export const calcRating = (age: number): number => {
  const ageBoolean = getAgeBoolean(age);
  return getRand(0, ageBoolean * (33 - age) * 3);
};

export const calcContract = (rating: number, potential: number): Contract => {
  const yearsLeft = getRand(1, 5);
  const price =
    Math.pow(rating / 25, 3) * 0.75 + Math.pow(potential / 25, 3) * 0.25;

  return {
    price,
    yearsLeft,
  };
};
