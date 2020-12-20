import Player from "../player/Player";

export interface Roster {
  starters: Player[];
  bench: Player[][];
}

export const getStarter = (roster: Roster, pos: number): Player => {
  return roster.starters[pos];
};
