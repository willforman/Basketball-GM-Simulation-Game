import Player from "../player/Player";
import { Pick } from "./Pick";

export interface TradeItems {
  players: Player[];
  picks: Pick[];
}
