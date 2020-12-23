import Player from "../player/Player";

export default class Starters {
  private PG: Player | null;
  private SG: Player | null;
  private SF: Player | null;
  private PF: Player | null;
  private C: Player | null;

  private all: (Player | null)[];

  constructor() {
    this.PG = null;
    this.SG = null;
    this.SF = null;
    this.PF = null;
    this.C = null;

    this.all = [this.PG, this.SG, this.SF, this.PF, this.C];
  }

  add(player: Player): void {
    const pos = player.getPositionNum();

    if (this.all[pos]) {
      throw new Error("Can't add because player is already in this spot");
    }
    this.all[pos] = player;
  }

  get(pos: number): Player | null {
    if (0 > pos || 4 < pos) {
      throw new Error(`Invalid position given: ${pos}`);
    }
    return this.all[pos];
  }

  getArray(): (Player | null)[] {
    return this.all;
  }
}
