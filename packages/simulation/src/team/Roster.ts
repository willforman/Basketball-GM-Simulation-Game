import Player from "../player/Player";
import { Choice } from "../models/Choice";
import RandomSelector from "../services/RandomSelector";

export default class Roster {
  private positions: Position[];

  private genPlayerName: () => string;
  private getNextId: () => number; // increment player id number for league
  private retire: (player: Player) => void;

  constructor(genPlayerName: () => string, getNextId: () => number) {
    this.genPlayerName = genPlayerName;
    this.getNextId = getNextId;

    this.retire = (player: Player) => {
      this.remove(player);
    };

    this.positions = [];

    // create the position objs and gen players for them
    for (let i = 0; i < 5; i++) {
      const starter = new Player(
        this.genPlayerName(),
        this.getNextId(),
        i,
        this.retire
      );
      this.positions.push(new Position(starter));
    }

    // generate 10 random players and add them
    for (let i = 0; i < 10; i++) {
      const pos = Math.floor(Math.random() * 6);
      const player = new Player(
        this.genPlayerName(),
        this.getNextId(),
        pos,
        this.retire
      );
      this.add(player);
    }
  }

  add(player: Player): void {
    const pos = player.getPositionNum();

    const posObj = this.positions[pos];

    posObj.add(player);
  }

  get(pos: number): Player | null {
    if (0 > pos || 4 < pos) {
      throw new Error(`Invalid position given: ${pos}`);
    }
    return this.positions[pos].getStarter();
  }

  getBench(pos: number): Player[] {
    return this.positions[pos].getBench();
  }

  getStarters(): (Player | null)[] {
    return [
      this.positions[0].getStarter(),
      this.positions[1].getStarter(),
      this.positions[2].getStarter(),
      this.positions[3].getStarter(),
      this.positions[4].getStarter(),
    ];
  }

  getStartersNonNull(): Player[] {
    if (!this.isValid()) {
      console.error(
        this.positions.map((pos: Position) => pos.getStarter()?.getId())
      );
      throw new Error(`Can't get non null roster if roster has null spot`);
    }
    return [
      this.positions[0].getStarter()!,
      this.positions[1].getStarter()!,
      this.positions[2].getStarter()!,
      this.positions[3].getStarter()!,
      this.positions[4].getStarter()!,
    ];
  }

  getArray(): Player[] {
    return [
      ...this.positions[0].getAll(),
      ...this.positions[1].getAll(),
      ...this.positions[2].getAll(),
      ...this.positions[3].getAll(),
      ...this.positions[4].getAll(),
    ];
  }

  remove(player: Player): void {
    const pos = player.getPositionNum();

    this.positions[pos].remove(player);
  }

  // returns a new list of starters
  getSubs(): Player[] {
    return this.positions.map((pos: Position) => pos.getSub());
  }

  // determines if roster is empty at any position
  // can't start game if so
  isValid(): boolean {
    return !this.positions.some((pos: Position) => !pos.hasStarter());
  }
}

class Position {
  private starter: Player | null;
  private bench: Player[];

  constructor(starter: Player) {
    this.starter = starter;
    this.bench = [];
  }

  add(player: Player): void {
    if (!this.starter) {
      this.starter = player;
    } else {
      this.bench.push(player);
    }
  }

  getStarter(): Player | null {
    return this.starter;
  }

  getBench(): Player[] {
    return this.bench;
  }

  getAll(): Player[] {
    if (this.starter) {
      return [this.starter, ...this.bench];
    }
    return this.bench;
  }

  remove(player: Player): void {
    if (player === this.starter) {
      const benchPlayer = this.bench.pop();

      if (!benchPlayer) {
        throw new Error("Can't remove starter with empty bench");
      }

      this.starter = benchPlayer;
    } else {
      const idxFoundAt = this.bench.indexOf(player);

      if (idxFoundAt === -1) {
        throw new Error(`Player couldn't be found`);
      }

      this.bench.splice(idxFoundAt, 1);
    }
  }

  getSub(): Player {
    const choices: Choice<Player>[] = this.getAll().map((player: Player) => ({
      item: player,
      weight: player.getSubOdds(),
    }));

    return new RandomSelector(choices).getChoice();
  }

  getIfEmpty(): boolean {
    return !this.starter || this.bench.length !== 0;
  }

  hasStarter(): boolean {
    return this.starter !== null;
  }
}
