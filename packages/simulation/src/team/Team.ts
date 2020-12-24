import Player from "../player/Player";
import Game from "../game/Game";
import { TeamNames } from "../models";
import Roster from "./Roster";
import DraftPicks from "./DraftPicks";

export default class Team {
  private name: string;
  private location: string;
  private abbreviation: string;

  private wins: number;
  private losses: number;

  private roster: Roster;
  private games: Game[];

  private picks: DraftPicks;

  private genPlayerName: () => string;
  private getNextId: () => number; // increment player id number for league

  constructor(
    names: TeamNames,
    genPlayerName: () => string,
    getNextId: () => number,
    rosterSize: number,
    currYear: number
  ) {
    this.name = names.name;
    this.location = names.location;
    this.abbreviation = names.abbreviation;

    this.genPlayerName = genPlayerName;
    this.getNextId = getNextId;

    this.wins = 0;
    this.losses = 0;

    this.games = [];

    this.roster = new Roster();

    const retire = (player: Player) => {
      this.roster.remove(player);
    };

    for (let i = 0; i < rosterSize; i++) {
      const player = new Player(genPlayerName(), getNextId(), i, retire);

      this.roster.add(player);
    }

    this.picks = new DraftPicks(this, currYear);
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

  // get methods

  getRoster(): Roster {
    return this.roster;
  }

  getAbreviation(): string {
    return this.abbreviation;
  }

  getStarter(pos: number): Player | null {
    return this.roster.get(pos);
  }

  getPlayerArray(): Player[] {
    return this.roster.getArray();
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
