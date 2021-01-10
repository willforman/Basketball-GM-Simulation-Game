import { Move } from "../models";

export default class Stats {
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

  private _getPot: () => number;

  constructor(
    statsArr: number[],
    primaryIdxs: number[],
    getPotential: () => number
  ) {
    this._getPot = getPotential;
    this._stats = [];

    statsArr.forEach((stat: number, idx: number) => {
      const isPrimary = primaryIdxs.includes(idx);
      this._stats.push(new Stat(stat, isPrimary));
    });
  }

  // sums growth for each stat and returns sum / 3, rounded
  // can range from 0 to 60 (inclusive)
  calcRating(): number {
    const sum = this._stats.reduce(
      (sum: number, curr: Stat) => sum + curr.growth,
      0
    );
    return Math.round(sum / 3);
  }

  updateStats(): void {
    this._stats.forEach((stat: Stat) => stat.update(this._getPot()));
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
}

class Stat {
  private _base: number;
  private _growth: number;

  private _maxGrowth: number;

  constructor(base: number, isPrimary: boolean) {
    this._base = base;
    this._maxGrowth = isPrimary ? 30 : 15;
  }

  get(): number {
    return this._base + this._growth;
  }

  get growth(): number {
    return this._growth;
  }

  update(potential: number): void {
    const rawPot = potential - 40; // potential can only go from 40 to 100, so this ranges from 0 to 60
    this._growth += Math.round(
      Math.random() * ((this._growth - this._maxGrowth) * (rawPot - 15))
    );
  }
}
