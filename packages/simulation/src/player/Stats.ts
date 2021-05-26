import { Move } from "../models";

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
  private _rating: number;

  private _getPot: () => number;

  constructor(
    statsArr: number[],
    primaryIdxs: number[],
    getPotential: () => number,
    startRating: number
  ) {
    this._getPot = getPotential;
    this._rating = startRating;

    this._stats = [];
    statsArr.forEach((stat: number, idx: number) => {
      let startGrowth = 0;
      if (startRating > 0) {
        if (idx === statsArr.length - 1) {
          startGrowth = startRating;
        } else {
          const upperBoundRand =
            startRating > 15 ? startRating / 2 : startRating;
          startGrowth = Math.floor(Math.random() * upperBoundRand + 1);
        }
      }

      const isPrimary = primaryIdxs.includes(idx);
      this._stats.push(new Stat(stat, isPrimary, startGrowth));
    });
  }

  updateStats(): void {
    this._stats.forEach((stat: Stat) => stat.update(this._getPot()));

    // update the rating stat
    const sum = this._stats.reduce(
      (sum: number, curr: Stat) => sum + curr.growth,
      0
    );
    this._rating = Math.round(sum / 3);
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
    return this._rating;
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

class Stat {
  private _base: number;
  private _growth: number;

  private _isPrimary: number;

  constructor(base: number, isPrimary: boolean, startGrowth: number) {
    this._base = base;
    this._growth = startGrowth;
  }

  get(): number {
    const growth = this._growth * this._isPrimary ? 2 : 1;
    return this._base + growth;
  }

  get growth(): number {
    return this._isPrimary ? 2 : 1 * this._growth;
  }

  update(potential: number): number {
    const rawPot = potential - 40; // potential can only go from 40 to 100, so this ranges from 0 to 60
    let change = Math.round(
      Math.random() * (15 - this._growth - (rawPot / 4 - 15))
    );
    if (change + this._growth < 0) {
      change = 0 - this._growth;
    } else if (change + this._growth > 15) {
      change = 15 - this._growth;
    }

    this._growth += change;
    return change;
  }
}
