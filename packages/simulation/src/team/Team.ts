import Player from "../player/Player";
import { Roster, TeamNames } from "../models";

export default class Team {
  private name: string;
  private location: string;
  private abbreviation: string;

  private wins: number;
  private losses: number;

  private roster: Roster;

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

    this.roster = {
      starters: [],
      bench: [],
    };

    for (let i = 0; i < rosterSize; i++) {
      const player = new Player(genPlayerName(), getNextId(), i);

      if (0 <= i && i <= 4) {
        this.roster.starters.push(player);
        this.roster.bench.push([]); // also need to push the 5 arrays for each position
      } else {
        const pos = player.getPositionNum();
        this.roster.bench[pos].push(player);
      }
    }
  }
  // get methods

  getRoster(): Roster {
    return this.roster;
  }

  getAbreviation(): string {
    return this.abbreviation;
  }

  getStarter(pos: number): Player {
    if (pos < 0 && pos > 4) {
      throw new Error(`Invalid position given: ${pos}`);
    }

    return this.roster.starters[pos];
  }

  getNumberOfPlayers(): number {
    return 5 + this.getBenchArray().length;
  }

  getBenchArray(): Player[] {
    return this.roster.bench.reduce((acc: Player[], benchPos: Player[]) => {
      return acc.concat(benchPos);
    }, []);
  }

  getPlayerArray(): Player[] {
    return this.roster.starters.concat(this.getBenchArray());
  }

  getLocation(): string {
    return this.location;
  }
}
