import Player from "../player/Player";
import { Choice } from "../models/Choice";
import RandomSelector from "../services/RandomSelector";

export default class Roster {
  private positions: Position[];

  constructor() {
    this.positions = [
      new Position(),
      new Position(),
      new Position(),
      new Position(),
      new Position(),
    ];
  }

  add(player: Player): void {
    const pos = player.getPositionNum();

    const posObj = this.positions[pos];

    posObj.add(player);
  }

  get(pos: number): Player {
    if (0 > pos || 4 < pos) {
      throw new Error(`Invalid position given: ${pos}`);
    }
    return this.positions[pos].getStarter();
  }

  getBench(pos: number): Player[] {
    return this.positions[pos].getBench();
  }

  getStarters(): Player[] {
    return [
      this.positions[0].getStarter(),
      this.positions[1].getStarter(),
      this.positions[2].getStarter(),
      this.positions[3].getStarter(),
      this.positions[4].getStarter(),
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
}

class Position {
  private starter: Player;
  private bench: Player[];

  constructor() {
    this.bench = [];
  }

  add(player: Player): void {
    if (!this.starter) {
      this.starter = player;
    } else {
      this.bench.push(player);
    }
  }

  getStarter(): Player {
    return this.starter;
  }

  getBench(): Player[] {
    return this.bench;
  }

  getAll(): Player[] {
    return [this.starter, ...this.bench];
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
}
