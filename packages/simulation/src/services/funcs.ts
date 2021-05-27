import { Player } from "../player/Player";

export const getRandElem = <T>(arr: T[]): T => {
  if (!arr) {
    throw new Error("Arr is undefined in getRandElem");
  }
  return arr[Math.floor(Math.random() * arr.length)];
};

export const pickRandElems = <T>(
  arr: T[],
  shouldAdd: (elemToAdd: T, currArr: T[]) => boolean,
  shouldReturn?: (arrToCheck: T[]) => boolean
): T[] => {
  if (!arr) {
    throw new Error("Arr is undefined");
  }

  const randOrder = arr.sort((a: T, b: T) => Math.random());

  if (!shouldReturn) {
    shouldReturn = () => false;
  }

  const picked: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (shouldAdd(randOrder[i], picked)) {
      picked.push(randOrder[i]);
    }
    if (shouldReturn(picked) === true) {
      return picked;
    }
  }

  return picked;
};

// has 1 in x odds to return true
export const oneInXOdds = (x: number): boolean => {
  return Math.floor(Math.random() * x) === 0;
};

// used for debugging
export const mapPlayerIds = (players: Player[]): number[] => {
  return players.map((player: Player) => player.id);
};

export const zeros = (numZeros: number): number[] => {
  return new Array(numZeros).fill(0);
};
