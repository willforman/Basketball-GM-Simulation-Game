import Team from "../team/Team";
import Player from "../player/Player";

export interface Pick {
  teamOwning: Team;
  teamOrig: Team;
  playerPicked: Player | null;
  round: number;
  yearsAway: number;
}
