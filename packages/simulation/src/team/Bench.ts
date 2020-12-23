import Player from "../player/Player";

export default class Bench {
  private PG: Player[];
  private SG: Player[];
  private SF: Player[];
  private PF: Player[];
  private C: Player[];

  private all: Player[][];

  constructor() {
    this.PG = [];
    this.SG = [];
    this.SF = [];
    this.PF = [];
    this.C = [];

    this.all = [this.PG, this.SG, this.SF, this.PF, this.C];
  }

  add(player: Player): void {
    const pos = player.getPositionNum();
    this.all[pos].push(player);
  }

  get(pos: number): Player[] {
    if (0 > pos || 4 < pos) {
      throw new Error(`Invalid position given: ${pos}`);
    }
    return this.all[pos];
  }

  getArray(): Player[] {
    return this.PG.concat(this.SG, this.SF, this.PF, this.C);
  }
}
