import Player from "../player/player";
import PlayerNameGenService from "../services/PlayerNameService";
import { Roster, TeamNames } from "../models";

export default class Team {
  private name: string;
  private location: string;
  private abbreviation: string;

  private wins: number;
  private losses: number;

  private roster: Roster;

  private playerNameGen: PlayerNameGenService;
  private getNextId: () => number; // increment player id number for league

  constructor(
    names: TeamNames,
    playerNameGen: PlayerNameGenService,
    getNextId: () => number,
    rosterSize: number
  ) {
    this.name = names.name;
    this.location = names.location;
    this.abbreviation = names.abbreviation;

    this.playerNameGen = playerNameGen;
    this.getNextId = getNextId;

    this.wins = 0;
    this.losses = 0;

    const bench = [];

    for (let i = 0; i < rosterSize; i++) {
      const name = playerNameGen.getName();

      bench.push(new Player(name, i, getNextId()));
    }

    // can use non-null-assertion (!) because know the array will have
    // more than 5 players, so shift() will never return undefined
    this.roster = {
      PG: bench.shift()!,
      SG: bench.shift()!,
      SF: bench.shift()!,
      PF: bench.shift()!,
      C: bench.shift()!,
      bench,
    };
  }
  // get methods

  getRoster(): Roster {
    return this.roster;
  }

  getAbreviation(): string {
    return this.abbreviation;
  }

  getPlayer(pos: number): Player {
    switch (pos) {
      case 0:
        return this.roster.PG;
      case 1:
        return this.roster.SG;
      case 2:
        return this.roster.SF;
      case 3:
        return this.roster.PF;
      case 4:
        return this.roster.C;
      default:
        throw Error(`Illegal position given: ${pos}`);
    }
  }

  getNumberOfPlayers(): number {
    return 5 + this.roster.bench.length;
  }

  getPlayerArray(): Player[] {
    const values = Object.values(this.roster);

    const benchPlayers = values.pop();

    return values.concat(benchPlayers);
  }
}
