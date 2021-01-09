import BoxScore from "../game/BoxScore";
import Player from "../player/Player";

export interface GameResult {
  homeBoxScores: Map<Player, BoxScore>;
  awayBoxScores: Map<Player, BoxScore>;
  homeScore: number;
  awayScore: number;
}
