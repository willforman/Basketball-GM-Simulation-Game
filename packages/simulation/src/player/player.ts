import BoxScore from "../game/BoxScore";
import { getStats } from "./statGen";
import { Move, Location } from "../models";

export default class Player {
  private name: string;
  private age: number;

  private pos: number; // position, 0 = PG, 1 = SG, 2 = SF, 3 = PF, 4 = C
  private archetype: string; // determines type of player with stats

  private rating: number;

  private id: number;

  // offense stats
  private insideShot: number;
  private midShot: number;
  private threePtShot: number;
  private passing: number;

  // defense stats
  private insideDefense: number;
  private midDefense: number;
  private threePtDefense: number;
  private stealing: number;

  private rebounding: number;

  getLoc: () => Location;
  getMove: (loc: Location) => Move;

  private boxScores: BoxScore[];

  constructor(name: string, id: number, pos: number) {
    this.name = name;
    this.id = id;

    // if given valid position, use that, otherwise generate random one
    this.pos = 0 <= pos && pos <= 4 ? pos : this.getRand(0, 4);

    this.age = this.getRand(19, 34);

    this.rating = 80;

    this.id = id;

    this.boxScores = [];

    const archetypeNum = this.pos + this.getRand(0, 1);

    const { archetype, stats, getLocation, getMove } = getStats(archetypeNum);

    this.archetype = archetype;
    this.getLoc = getLocation;
    this.getMove = getMove;

    // assign stats from statgen
    this.insideShot = stats[0];
    this.midShot = stats[1];
    this.threePtShot = stats[2];
    this.passing = stats[3];
    this.insideDefense = stats[4];
    this.midDefense = stats[5];
    this.threePtDefense = stats[6];
    this.stealing = stats[7];
    this.rebounding = stats[8];
  }

  private getRand(lb: number, ub: number): number {
    return Math.floor(Math.random() * (ub - lb + 1)) + lb;
  }

  // get methods
  getName(): string {
    return this.name;
  }

  getArchetype(): string {
    return this.archetype;
  }

  getId(): number {
    return this.id;
  }

  goToNextYear(): void {
    this.age++;
  }

  addBoxScore(boxScore: BoxScore): void {
    this.boxScores.push(boxScore);
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

  getRatingMultiplier(): number {
    return this.rating / 100;
  }

  getRebounding(): number {
    return this.rebounding;
  }

  getPositionNum(): number {
    return this.pos;
  }

  // used for determining weight of getting subbed into game
  getSubOdds(): number {
    return Math.min(this.rating - 40, 10);
  }
}
