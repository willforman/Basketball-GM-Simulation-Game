import RandomSelector from "../services/RandomSelector";
import { Choice, moves, locations } from "../models";

export interface StatsGen {
  archetype: string;
  stats: number[];
  getLocation: () => string;
  getMove: (s: string) => string;
}

interface Location {
  name: string;
  choice: Choice<string>;
  getMove: () => string;
}

const makeLocation = (
  locationName: string,
  probWeight: number,
  moveProbWeights: number[]
): Location => {
  // turn array of probabilities into array of Choice objs
  const choices = moveProbWeights.map((moveProb: number, i: number) => ({
    item: moves[i],
    weight: moveProb,
  }));

  const getMove = new RandomSelector(choices).getChoice; // function will get move for this location

  // Choice obj for location
  const choice: Choice<string> = {
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
  let locs: Location[];

  switch (archetypeNum) {
    case 0:
      archetype = "Playmaker";
      stats = [20, 30, 65, 70, 85, 20, 35, 75, 15, 85, 20];
      locs = [
        makeLocation(locations[0], 1, [70, 20, 0, 10]),
        makeLocation(locations[1], 2, [20, 30, 10, 40]),
        makeLocation(locations[2], 17, [10, 10, 30, 50]),
        makeLocation(locations[3], 80, [10, 10, 20, 60]),
      ];
      break;
    case 1:
      archetype = "Sharpshooter";
      stats = [15, 85, 85, 85, 30, 15, 50, 85, 15, 40, 15];
      locs = [
        makeLocation(locations[0], 1, [40, 40, 0, 20]),
        makeLocation(locations[1], 2, [5, 50, 20, 25]),
        makeLocation(locations[2], 70, [5, 10, 55, 30]),
        makeLocation(locations[3], 27, [5, 10, 45, 40]),
      ];
      break;
    case 2:
      archetype = "Slasher";
      stats = [85, 50, 15, 40, 30, 40, 60, 40, 85, 20, 55];
      locs = [
        makeLocation(locations[0], 40, [85, 10, 0, 5]),
        makeLocation(locations[1], 55, [50, 30, 0, 20]),
        makeLocation(locations[2], 2, [10, 10, 30, 50]),
        makeLocation(locations[3], 3, [10, 10, 20, 60]),
      ];
      break;
    case 3:
      archetype = "Lockdown";
      stats = [30, 15, 15, 30, 50, 60, 85, 85, 60, 75, 15];
      locs = [
        makeLocation(locations[0], 30, [50, 0, 0, 50]),
        makeLocation(locations[1], 40, [10, 10, 0, 80]),
        makeLocation(locations[2], 10, [10, 15, 10, 65]),
        makeLocation(locations[3], 20, [10, 10, 10, 70]),
      ];
      break;
    case 4:
      archetype = "Stretch Big";
      stats = [70, 65, 65, 60, 15, 60, 30, 20, 50, 15, 70];
      locs = [
        makeLocation(locations[0], 55, [85, 10, 0, 5]),
        makeLocation(locations[1], 10, [25, 45, 10, 20]),
        makeLocation(locations[2], 33, [5, 10, 55, 30]),
        makeLocation(locations[3], 2, [5, 10, 50, 35]),
      ];
      break;
    case 5:
      archetype = "Rebounder";
      stats = [70, 15, 15, 15, 35, 85, 60, 40, 85, 15, 85];
      locs = [
        makeLocation(locations[0], 97, [90, 0, 0, 10]),
        makeLocation(locations[1], 3, [50, 30, 0, 20]),
        makeLocation(locations[2], 0, [10, 10, 10, 70]),
        makeLocation(locations[3], 0, [10, 10, 10, 70]),
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
  const choices = locs.map((loc: Location) => loc.choice);

  const getLocation = new RandomSelector(choices).getChoice;

  // getMove function
  const getMove = (locName: string): string => {
    const sameLoc = locs.find((loc: Location) => loc.name === locName);

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
