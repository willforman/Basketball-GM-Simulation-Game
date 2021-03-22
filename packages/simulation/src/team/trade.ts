import { Team } from "../team/Team";
import { Player } from "../player/Player";
import { pickRandElems, oneInXOdds, mapPlayerIds } from "../services/funcs";
import { Roster } from "./Roster";
import { ROSTER_SIZE, MAX_CAP } from "../models";

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
  return pickRandElems(
    playersCanGive,
    (p: Player) => true,
    (arr: Player[]) => Math.round(Math.random() * arr.length) === 1
  );
};

const calcCap = (players: Player[]): number => {
  return players.reduce(
    (curr: number, player: Player) => curr + player.contract.price,
    0
  );
};

export const getTradeRecieving = (
  playersCanRecieve: Player[],
  minPlayers: number,
  maxPlayers: number,
  minCap: number,
  maxCap: number
): Player[] => {
  const players = pickRandElems(
    playersCanRecieve,
    (player: Player, players: Player[]) =>
      players.length < maxPlayers &&
      calcCap(players) + player.contract.price < maxCap,
    (playersRecieving: Player[]) => {
      if (playersRecieving.length > minPlayers) {
        const cap = playersRecieving.reduce(
          (curr: number, player: Player) => curr + player.contract.price,
          0
        );
        if (cap > minCap) {
          return true;
        }
      }
      if (oneInXOdds(3)) {
        playersRecieving.shift();
      }
      return false;
    }
  );

  const cap = calcCap(players);

  if (minPlayers <= players.length && players.length <= maxPlayers) {
    if (minCap <= cap && cap <= maxCap) {
      return players;
    }
  }

  return [];
};

export const otherTeamAccept = (
  otherTeam: Roster,
  playersGiving: Player[],
  playersRecieving: Player[]
): boolean => {
  console.log(
    `get=${calcPlayersValue(
      otherTeam,
      playersRecieving
    )}, give=${calcPlayersValue(otherTeam, playersGiving)}`
  );
  return (
    calcPlayersValue(otherTeam, playersRecieving) >
    calcPlayersValue(otherTeam, playersGiving)
  );
};

const getXOtherTeams = (
  teams: Team[],
  x: number,
  teamCantPick: Team
): Team[] => {
  return pickRandElems(
    teams,
    (teamPicked: Team) => teamPicked !== teamCantPick,
    (teams: Team[]) => teams.length === 3
  );
};

export const proposeTrades = (teams: Team[]): void => {
  teams.forEach((teamTrading: Team) => {
    const teamsTradingWith = getXOtherTeams(teams, 3, teamTrading);

    teamsTradingWith.forEach((teamTradingWith: Team) => {
      const playersGiving = getTradeGiving(teamTrading.roster.allPlayers);

      if (playersGiving.length === 0) {
        return;
      }

      const maxPlayersCanRecieve =
        ROSTER_SIZE - teamTrading.roster.size + playersGiving.length;

      const maxCapCanRecieve =
        MAX_CAP - teamTrading.roster.cap + calcCap(playersGiving);

      const minPlayers =
        playersGiving.length - (ROSTER_SIZE - teamTradingWith.roster.size);

      const minCap =
        calcCap(playersGiving) - (MAX_CAP - teamTradingWith.roster.cap);

      console.log(
        `Cap: min=${minCap} max=${maxCapCanRecieve}\nPlayers: min=${minPlayers} max=${maxPlayersCanRecieve}`
      );

      const playersRecieving = getTradeRecieving(
        teamTradingWith.roster.allPlayers,
        minPlayers,
        maxPlayersCanRecieve,
        minCap,
        maxCapCanRecieve
      );

      console.log("before");

      if (playersRecieving.length === 0) {
        return;
      }

      console.log("after");

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

      console.log("trade complete");

      if (
        teamTrading.roster.size > ROSTER_SIZE ||
        teamTradingWith.roster.size > ROSTER_SIZE
      ) {
        console.error(
          `${teamTrading.roster.size}, ${teamTradingWith.roster.size}`
        );
        throw new Error("Illegal team sizes");
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
