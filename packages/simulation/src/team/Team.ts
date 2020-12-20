import Player from "../player/Player";
import { Roster, TeamNames } from "../models";

export default class Team {
  private name: string;
  private location: string;
  private abbreviation: string;

  private wins: number;
  private losses: number;

  private starters: Roster;
  private benchPositions: Map<number, Player>;

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

    this.benchPositions = new Map();

    this.starters = {
      PG: new Player(genPlayerName(), getNextId(), 0),
      SG: new Player(genPlayerName(), getNextId(), 1),
      SF: new Player(genPlayerName(), getNextId(), 2),
      PF: new Player(genPlayerName(), getNextId(), 3),
      C: new Player(genPlayerName(), getNextId(), 4),
    };

    for (let i = 0; i < rosterSize - 5; i++) {
      const player = new Player(genPlayerName(), getNextId());

      this.benchPositions.set(player.getPositionNum(), player);
    }
  }
  // get methods

  getRoster(): Roster {
    return this.starters;
  }

  getAbreviation(): string {
    return this.abbreviation;
  }

  getPlayer(pos: number): Player {
    switch (pos) {
      case 0:
        return this.starters.PG;
      case 1:
        return this.starters.SG;
      case 2:
        return this.starters.SF;
      case 3:
        return this.starters.PF;
      case 4:
        return this.starters.C;
      default:
        throw Error(`Illegal position given: ${pos}`);
    }
  }

  getNumberOfPlayers(): number {
    return 5 + this.starters.bench.length;
  }

  getPlayerArray(): Player[] {
    const values = Object.values(this.starters);

    const benchPlayers = values.pop();

    return values.concat(benchPlayers);
  }

  getLocation(): string {
    return this.location;
  }

  getBench(): Map<number, Player> {
    return this.benchPositions;
  }
}
