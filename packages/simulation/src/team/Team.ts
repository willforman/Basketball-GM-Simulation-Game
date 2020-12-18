import Player from "../player/player";
import NameGen from "../services/NameGen";
import { Roster, TeamNames } from "../models";

export default class Team {
  private name: string;
  private location: string;
  private abbreviation: string;

  private wins: number;
  private losses: number;

  private roster: Roster;

  private nameGen: NameGen;
  private genPlayerName: Function;
  private getNextId: Function; // increment player id number for league

  constructor(
    names: TeamNames,
    genPlayerName: Function,
    getNextId: Function,
    rosterSize: number
  ) {
    this.name = names.name;
    this.location = names.location;
    this.abbreviation = names.abbreviation;

    //this.nameGen = nameGen;
    this.getNextId = getNextId;

    this.wins = 0;
    this.losses = 0;

    let PG = null;
    let SG = null;
    let SF = null;
    let PF = null;
    let C = null;
    const bench = [];

    for (let i = 0; i < rosterSize; i++) {
      const name = genPlayerName();

      const player = new Player(name, i, getNextId());

      switch (i) {
        case 0:
          PG = player;
          break;
        case 1:
          SG = player;
          break;
        case 2:
          SF = player;
          break;
        case 3:
          PF = player;
          break;
        case 4:
          C = player;
          break;
        default:
          bench.push(player);
      }
    }

    this.roster = {
      PG,
      SG,
      SF,
      PF,
      C,
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
