import Team from "../team/Team";
import Player from "../player/Player";
import { pickRandElems, oneInXOdds, mapPlayerIds } from "../services/funcs";
import Roster from "./Roster";
import { ROSTER_SIZE } from "../models";

export const calcPlayersValue = (
  rosterEvaluating: Roster,
  players: Player[]
): number => {
  return players.reduce(
    (totVal: number, currPlayer) =>
      totVal + rosterEvaluating.calcValueIfAdded(currPlayer),
    0
  );
};

export const getTradeGiving = (playersCanGive: Player[]): Player[] => {
  return pickRandElems(playersCanGive, (p: Player) => oneInXOdds(7));
};

export const getTradeRecieving = (
  playersGiving: Player[],
  rosterGiving: Roster, // needed to evaluate the value of players giving
  playersCanRecieve: Player[],
  maxPlayersCanRecieve: number
): Player[] => {
  const givingVal = calcPlayersValue(rosterGiving, playersGiving);

  return pickRandElems(
    playersCanRecieve,
    (player: Player) => oneInXOdds(1),
    (playersRecieving: Player[]) => {
      if (playersRecieving.length === maxPlayersCanRecieve) {
        console.log(`max=${maxPlayersCanRecieve}`);
        return true;
      }
      const receivingVal = calcPlayersValue(rosterGiving, playersRecieving);
      return Math.random() * Math.abs(givingVal - receivingVal) < 5;
    }
  );
};

export const otherTeamAccept = (
  otherTeam: Roster,
  playersGiving: Player[],
  playersRecieving: Player[]
): boolean => {
  return (
    calcPlayersValue(otherTeam, playersRecieving) >
    calcPlayersValue(otherTeam, playersGiving)
  );
};

export const proposeTrades = (teams: Team[]): void => {
  teams.forEach((teamTrading: Team) => {
    const teamsTradingWith = pickRandElems(
      teams,
      (teamPicked: Team) => teamPicked !== teamTrading,
      (teams: Team[]) => teams.length === 3
    );

    teamsTradingWith.forEach((teamTradingWith: Team) => {
      const playersGiving = getTradeGiving(teamTrading.roster.allPlayers);

      const maxPlayersCanRecieve =
        ROSTER_SIZE - playersGiving.length - teamTrading.roster.size;

      const playersRecieving = getTradeRecieving(
        playersGiving,
        teamTrading.roster,
        teamTradingWith.roster.allPlayers,
        maxPlayersCanRecieve
      );

      if (
        otherTeamAccept(teamTradingWith.roster, playersRecieving, playersGiving)
      ) {
        swapPlayers(
          teamTrading.roster,
          teamTradingWith.roster,
          playersGiving,
          playersRecieving
        );
      }
    });
  });
};

export const swapPlayers = (
  roster1: Roster,
  roster2: Roster,
  players1: Player[],
  players2: Player[]
): void => {
  console.log(`1=${mapPlayerIds(players1)}`);
  console.log(`2=${mapPlayerIds(players2)}`);

  roster1.removeMultiple(players1);
  roster2.removeMultiple(players2);

  roster1.addMultiple(players2);
  roster2.addMultiple(players1);
};
