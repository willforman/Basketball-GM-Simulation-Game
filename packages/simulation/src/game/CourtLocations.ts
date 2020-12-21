import Player from "../player/Player";
import { Move, Location, locationArr } from "../models";

export default class CourtLocations {
  private players: Player[];
  private locs: Map<Location, Player[]>;

  constructor(players: Player[]) {
    this.players = players;
    this.locs = new Map();
  }

  getNewLocs(): void {
    // need to clear all old arrays
    locationArr.forEach((locName: Location) => {
      this.locs.set(locName, []);
    });

    // then for each player, put them at random location
    this.players.forEach((player: Player) => {
      const locName = player.getLoc();
      this.getPlayersAtLocation(locName).push(player);
    });
  }

  private getPlayersAtLocation(locName: Location): Player[] {
    const players = this.locs.get(locName);

    if (!players) {
      throw new Error(`Invalid location given: ${locName}`);
    }

    return players;
  }

  getLocOfPlayer(player: Player): Location {
    const locs = Array.from(this.locs.keys());

    const loc = locs.find((loc: Location) => {
      const playerArrHere = this.locs.get(loc);

      if (!playerArrHere) {
        throw new Error(`Player array messed up in locs`);
      }

      return playerArrHere.some(
        (playerAtLoc: Player) => player === playerAtLoc
      );
    });

    if (!loc) {
      throw new Error(`Invalid player given: ${player}`);
    }

    return loc;
  }

  getRandPlayerAtLocation(locName: Location): Player | null {
    const players = this.getPlayersAtLocation(locName);

    if (players == []) {
      return null;
    }

    return players[Math.floor(Math.random() * players.length)];
  }

  getDefenderFromOffMove(offMove: Move, offPlayerLoc: Location): Player | null {
    switch (offMove) {
      case Move.PASS:
        throw new Error(`Can't get defender location when move is pass`);
      case Move.INSIDE_SHOT:
        return this.getRandPlayerAtLocation(Location.PAINT);
      case Move.MID_SHOT:
        return this.getRandPlayerAtLocation(Location.MID_RANGE);
      case Move.THREE_PT_SHOT:
        return this.getRandPlayerAtLocation(offPlayerLoc);
    }
  }
}
