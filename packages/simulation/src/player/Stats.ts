import { Move, NUM_STATS } from "../models";
import { getRand } from "../services/funcs";

export class Stats {
  // 0: inside shot
  // 1: mid shot
  // 2: three pt shot
  // 3: passing
  // 4: inside def
  // 5: mid def
  // 6: three pt def
  // 7: stealing
  // 8: rebounding
  private _stats: Stat[];

  constructor(stats: Stat[]) {
    this._stats = stats;
  }

  updateStats(newPot: number): void {
    this._stats.forEach((stat: Stat) => stat.update(newPot));
  }

  getOffenseRating(offMove: Move): number {
    switch (offMove) {
      case Move.INSIDE_SHOT:
        return this.insideShot;
      case Move.MID_SHOT:
        return this.midShot;
      case Move.THREE_PT_SHOT:
        return this.threePtShot;
      case Move.PASS:
        return this.passing;
    }
  }

  // get defense rating based on offense move used
  getDefenseRating(offMove: Move): number {
    switch (offMove) {
      case Move.INSIDE_SHOT:
        return this.insideDefense;
      case Move.MID_SHOT:
        return this.midDefense;
      case Move.THREE_PT_SHOT:
        return this.threePtDefense;
      case Move.PASS:
        return this.stealing;
    }
  }

  // sums growth for each stat and returns sum / 3, rounded
  // can range from 0 to 60 (inclusive)
  get rating(): number {
    const sum = this._stats.reduce(
      (sum: number, curr: Stat) => sum + curr.value,
      0
    );
    return (sum * 2) / NUM_STATS;
  }

  get insideShot(): number {
    return this._stats[0].get();
  }

  get midShot(): number {
    return this._stats[1].get();
  }

  get threePtShot(): number {
    return this._stats[2].get();
  }

  get passing(): number {
    return this._stats[3].get();
  }

  get insideDefense(): number {
    return this._stats[4].get();
  }

  get midDefense(): number {
    return this._stats[5].get();
  }

  get threePtDefense(): number {
    return this._stats[6].get();
  }

  get stealing(): number {
    return this._stats[7].get();
  }

  get rebounding(): number {
    return this._stats[8].get();
  }

  get all(): number[] {
    return this._stats.map((curr: Stat) => curr.get());
  }
}

export class Stat {
  private _value: number;
  private _primaryMult: number; // 2 if primary stat, 1 if not

  constructor(value: number, primaryMult: number) {
    this._value = value;
    this._primaryMult = primaryMult;
  }

  get(): number {
    return 20 + this._value * this._primaryMult;
  }

  get value(): number {
    return this._value;
  }

  update(potential: number): number {
    const rawPot = potential - 40; // potential can only go from 40 to 100, so this ranges from 0 to 60
    const change = getRand(0, rawPot - this._value) - 10;
    this._value += change;
    if (this._value < 0) {
      this._value = 0;
    } else if (this._value > 40) {
      this._value = 40;
    }

    return change;
  }
}
