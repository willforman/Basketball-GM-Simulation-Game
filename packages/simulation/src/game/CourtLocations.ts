import Player from "../player/Player";
import { Move, Location, locationArr } from "../models";

export default class CourtLocations {
  private _players: Player[];
  private _locs: Map<Location, Player[]>;

  constructor(players: Player[]) {
    this.addPlayers(players);
  }

  addPlayers(players: Player[]): void {
    this._players = players;
    this._locs = new Map();
    this.getNewLocs();
  }

  // generates new locations of team except for given player
  getNewLocs(
    playerNeedsToBeAtLocation?: Player,
    locationOfPlayer?: Location
  ): void {
    // need to clear all old arrays
    locationArr.forEach((locName: Location) => {
      this._locs.set(locName, []);
    });

    // then for each player, put them at random location
    this._players.forEach((player: Player) => {
      // if theres a player that needs to be at a location, don't put them anywhere in loop
      if (player === playerNeedsToBeAtLocation) {
        return;
      }

      const locName = player.getLoc();
      this.getPlayersAtLocation(locName).push(player);
    });

    // then add player that needs to be at certain location to that location
    if (playerNeedsToBeAtLocation && locationOfPlayer) {
      this.getPlayersAtLocation(locationOfPlayer).push(
        playerNeedsToBeAtLocation
      );
    }
  }

  private getPlayersAtLocation(locName: Location): Player[] {
    const players = this._locs.get(locName);

    if (!players) {
      throw new Error(`Invalid location given: ${locName}`);
    }

    return players;
  }

  getLocOfPlayer(player: Player): Location {
    const locs = Array.from(this._locs.keys());

    const loc = locs.find((loc: Location) => {
      const playerArrHere = this._locs.get(loc);

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
