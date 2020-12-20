import Player from "../player/Player";
import locationNames from "../models/locations";
import { moves, locations } from "../models";

export default class CourtLocations {
  private locs: Map<string, Player[]>;

  constructor(players: Player[]) {
    this.locs = new Map();
    locationNames.forEach((locationName: string) => {
      this.locs.set(locationName, []);
    });

    players.forEach((player: Player) => {
      const locName = player.getLoc();
      this.getPlayersAtLocation(locName).push(player);
    });
  }

  getLocOfPlayer(player: Player): string {
    let foundAtLoc = "";
    for (const [locName, playersAtLoc] of Array.from(this.locs.entries())) {
      if (playersAtLoc.some((playerAtLoc: Player) => playerAtLoc === player)) {
        foundAtLoc = locName;
      }
    }

    if (!foundAtLoc) {
      throw new Error(`Given invalid player ${player}`);
    }

    return foundAtLoc;
  }

  private getPlayersAtLocation(locName: string): Player[] {
    const players = this.locs.get(locName);

    if (!players) {
      throw new Error(`Illegal location given: ${locName}`);
    }

    return players;
  }

  getRandPlayerAtLocation(locName: string): Player | null {
    const players = this.getPlayersAtLocation(locName);

    if (players == []) {
      return null;
    }

    return players[Math.floor(Math.random() * players.length)];
  }

  getDefenderFromOffMove(offMove: string): Player | null {
    if (offMove === moves[3]) {
      throw new Error("Can't get location when move is pass");
    }

    let player: Player | null;
    for (let i = 0; i < 3; i++) {
      if (moves[i] === offMove) {
        player = this.getRandPlayerAtLocation(locations[i]);
      }
    }

    return player!;
  }
}
