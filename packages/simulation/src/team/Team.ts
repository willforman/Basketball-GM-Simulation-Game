import Player from "../player/Player";
import Game from "../game/Game";
import { Roster, TeamNames } from "../models";
import Starters from "./Starters";
import Bench from "./Bench";

export default class Team {
  private name: string;
  private location: string;
  private abbreviation: string;

  private wins: number;
  private losses: number;

  private roster: Roster;

  private games: Game[];

  private genPlayerName: () => string;
  private getNextId: () => number; // increment player id number for league

  constructor(
    names: TeamNames,
    genPlayerName: () => string,
    getNextId: () => number,
    rosterSize: number
  ) {
    this.name = names.name;
    this.location = names.location;
    this.abbreviation = names.abbreviation;

    this.genPlayerName = genPlayerName;
    this.getNextId = getNextId;

    this.wins = 0;
    this.losses = 0;

    this.games = [];

    this.roster = {
      starters: new Starters(),
      bench: new Bench(),
    };

    const retire = (player: Player) => {
      this.removePlayer(player);
    };

    for (let i = 0; i < rosterSize; i++) {
      const player = new Player(genPlayerName(), getNextId(), i, retire);

      if (0 <= i && i <= 4) {
        this.roster.starters.add(player);
      } else {
        this.roster.bench.add(player);
      }
    }
  }

  advanceYear(): void {
    this.getPlayerArray().forEach((player: Player | null) => {
      if (player) {
        player.advanceYear();
      }
    });
  }

  addGame(game: Game): void {
    this.games.push(game);
  }

  removePlayer(playerToRemove: Player): void {
    const pos = playerToRemove.getPositionNum();

    const starterAtPos = this.roster.starters.get(pos);

    if (starterAtPos === playerToRemove) {
      starterAtPos === null;
    } else {
      const benchPos = this.roster.bench.get(pos);

      const idxFoundAt = benchPos.indexOf(playerToRemove);

      if (idxFoundAt === -1) {
        throw new Error(`Couldn't find given player on roster`);
      }

      benchPos.splice(idxFoundAt, 1);
    }
  }

  // get methods

  getRoster(): Roster {
    return this.roster;
  }

  getAbreviation(): string {
    return this.abbreviation;
  }

  getStarter(pos: number): Player | null {
    return this.roster.starters.get(pos);
  }

  getNumberOfPlayers(): number {
    return 5 + this.roster.bench.getArray().length;
  }

  getPlayerArray(): (Player | null)[] {
    return this.roster.starters.getArray().concat(this.roster.bench.getArray());
  }

  getLocation(): string {
    return this.location;
  }

  getWins(): number {
    return this.wins;
  }

  getLosses(): number {
    return this.losses;
  }
}
