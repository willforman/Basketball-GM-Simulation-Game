import { Pick, TradeItems } from "../models";
import Player from "../player/Player";

const getPickValue = (pick: Pick): number => {
  const yearsAwayVal = Math.pow(5 - pick.yearsAway, 2); // 0 - 25
  const roundVal = pick.round === 1 ? 50 : 15; // 0 - 50
  const performanceVal = pick.teamOwning.wins / 25; // 0 - 25
  return yearsAwayVal + roundVal + performanceVal; // 0 - 100
};

const getPlayerValue = (player: Player): number => {
  return (player.potential * 1.5 + player.rating) * 0.4 * 3; // 0 - 300
};

const sumTradeItems = (tradeItems: TradeItems): number => {
  const playerSum = tradeItems.players.reduce(
    (sum: number, curr: Player) => sum + getPlayerValue(curr),
    0
  );
  const pickSum = tradeItems.picks.reduce(
    (sum: number, curr: Pick) => sum + getPickValue(curr),
    0
  );

  return playerSum + pickSum;
};

// t1 is items proposed to trade for t2
// evaluates if t2 is a fair trade for t1
export default (t1: TradeItems, t2: TradeItems): boolean => {
  const s1 = sumTradeItems(t1);
  const s2 = sumTradeItems(t2);

  return Math.abs(s1 - s2) <= 25;
};
