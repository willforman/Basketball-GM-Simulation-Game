import Player from "../player/Player";

export default interface Roster {
  PG: Player;
  SG: Player;
  SF: Player;
  PF: Player;
  C: Player;
  bench: Player[];
}
