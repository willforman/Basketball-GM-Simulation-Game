import RandomSelector from "../services/RandomSelector";
import { Choice, Move, Location, moveArr, locationArr } from "../models";

export interface StatsGen {
  archetype: string;
  stats: number[];
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

export function getStats(archetypeNum: number): StatsGen {
  // stats order:
  // inside shot, 3 pt shot
  // free throw, passing
  // inside defense, 3 pt defense
  // blocking, stealing
  // rebounding
  let archetype: string;
  let stats: number[];
  let locs: LocationObj[];

  switch (archetypeNum) {
    case 0:
      archetype = "Playmaker";
      stats = [20, 30, 65, 70, 85, 20, 35, 75, 15, 85, 20];
      locs = [
        makeLocation(Location.PAINT, 1, [70, 20, 0, 10]),
        makeLocation(Location.MID_RANGE, 2, [20, 30, 10, 40]),
        makeLocation(Location.TOP_KEY, 80, [1, 4, 5, 90]),
        makeLocation(Location.CORNER, 17, [10, 10, 20, 60]),
      ];
      break;
    case 1:
      archetype = "Sharpshooter";
      stats = [15, 85, 85, 85, 30, 15, 50, 85, 15, 40, 15];
      locs = [
        makeLocation(Location.PAINT, 1, [40, 40, 0, 20]),
        makeLocation(Location.MID_RANGE, 2, [5, 50, 20, 25]),
        makeLocation(Location.TOP_KEY, 70, [2, 3, 25, 70]),
        makeLocation(Location.CORNER, 27, [2, 3, 55, 40]),
      ];
      break;
    case 2:
      archetype = "Slasher";
      stats = [85, 50, 15, 40, 30, 40, 60, 40, 85, 20, 55];
      locs = [
        makeLocation(Location.PAINT, 40, [85, 10, 0, 5]),
        makeLocation(Location.MID_RANGE, 55, [50, 30, 0, 20]),
        makeLocation(Location.TOP_KEY, 2, [10, 10, 30, 50]),
        makeLocation(Location.CORNER, 3, [10, 10, 20, 60]),
      ];
      break;
    case 3:
      archetype = "Lockdown";
      stats = [30, 15, 15, 30, 50, 60, 85, 85, 60, 75, 15];
      locs = [
        makeLocation(Location.PAINT, 30, [50, 0, 0, 50]),
        makeLocation(Location.MID_RANGE, 40, [10, 10, 0, 80]),
        makeLocation(Location.TOP_KEY, 10, [10, 15, 10, 65]),
        makeLocation(Location.CORNER, 20, [10, 10, 10, 70]),
      ];
      break;
    case 4:
      archetype = "Stretch Big";
      stats = [70, 65, 65, 60, 15, 60, 30, 20, 50, 15, 70];
      locs = [
        makeLocation(Location.PAINT, 55, [85, 10, 0, 5]),
        makeLocation(Location.MID_RANGE, 10, [25, 45, 10, 20]),
        makeLocation(Location.TOP_KEY, 33, [5, 10, 55, 30]),
        makeLocation(Location.CORNER, 2, [5, 10, 50, 35]),
      ];
      break;
    case 5:
      archetype = "Rebounder";
      stats = [70, 15, 15, 15, 35, 85, 60, 40, 85, 15, 85];
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

  if (stats.reduce((total: number, curr: number) => total + curr) != 520) {
    throw Error("Stats don't sum to 520");
  }

  // add number from -15 to 15 to each stat
  stats = stats.map((stat) => stat + getRandStatNum());

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
