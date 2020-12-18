import BoxScore from "../game/BoxScore";
import { getStats } from "./statGen";

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
  private freeThrowShot: number;
  private passing: number;

  // defense stats
  private insideDefense: number;
  private midDefense: number;
  private threePtDefense: number;
  private blocking: number;
  private stealing: number;

  private rebounding: number;

  private getLoc: () => string;
  private getMove: (s: string) => string;

  private boxScores: BoxScore[];

  constructor(name: string, pos: number, id: number) {
    this.name = name;
    this.age = this.getRand(19, 34);

    this.rating = 80;

    this.id = id;

    this.boxScores = [];

    // if given valid position, use that, otherwise generate random one
    this.pos = 0 <= pos && pos <= 4 ? pos : this.getRand(0, 4);

    const archetypeNum = this.pos + this.getRand(0, 1);

    const { archetype, stats, getLocation, getMove } = getStats(archetypeNum);

    this.archetype = archetype;
    this.getLoc = getLocation;
    this.getMove = getMove;

    // assign stats from statgen
    this.insideShot = stats[0];
    this.midShot = stats[1];
    this.threePtShot = stats[2];
    this.freeThrowShot = stats[3];
    this.passing = stats[4];
    this.insideDefense = stats[5];
    this.midDefense = stats[6];
    this.threePtDefense = stats[7];
    this.blocking = stats[8];
    this.stealing = stats[9];
    this.rebounding = stats[10];
  }

  private getRand(lb: number, ub: number) {
    return Math.floor(Math.random() * (ub - lb)) + lb;
  }

  // get methods
  getId(): number {
    return this.id;
  }

  goToNextYear(): void {
    this.age++;
  }

  addBoxScore(boxScore: BoxScore): void {
    this.boxScores.push(boxScore);
  }
}
