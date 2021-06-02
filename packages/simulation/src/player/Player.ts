import { BoxScore } from "../game/BoxScore";
import { Archetype, Contract, BOX_SCORE_STATS } from "../models";
import { Stats } from "./Stats";
import { zeros, getRand } from "../services/funcs";

export class Player {
  private _name: string;
  private _age: number;
  private _id: number;

  private _pos: number; // position, 0 = PG, 1 = SG, 2 = SF, 3 = PF, 4 = C
  private _archetype: Archetype; // determines type of player with stats

  private _potential: number;
  private _stats: Stats;

  private _contract: Contract;
  private _seasonStats: SeasonStats[];

  private _retire: (player: Player) => void;

  constructor(
    name: string,
    age: number,
    id: number,
    pos: number,
    archetype: Archetype,
    potential: number,
    stats: Stats,
    contract: Contract,
    seasonStats: SeasonStats[]
  ) {
    this._name = name;
    this._age = age;
    this._id = id;
    this._pos = pos;
    this._archetype = archetype;
    this._potential = potential;
    this._stats = stats;
    this._contract = contract;
    this._seasonStats = seasonStats;
  }

  advanceYear(): void {
    this._age++;

    if (getRand(0, this._age - 31) > 5) {
      this._retire(this);
    }

    this._contract.yearsLeft--;

    this._stats.updateStats(this._potential);
    this._seasonStats.push(new SeasonStats([]));
  }

  addBoxScore(boxScore: BoxScore): void {
    this._seasonStats[this._seasonStats.length - 1].add(boxScore);
  }

  // get methods
  get stats(): Stats {
    return this._stats;
  }

  get name(): string {
    return this._name;
  }

  get archetype(): Archetype {
    return this._archetype;
  }

  get id(): number {
    return this._id;
  }

  get potential(): number {
    return this._potential;
  }

  get rating(): number {
    return this.stats.rating;
  }

  get pos(): number {
    return this._pos;
  }

  get posStr(): string {
    switch (this._pos) {
      case 0:
        return "PG";
      case 1:
        return "SG";
      case 2:
        return "SF";
      case 3:
        return "PF";
      case 4:
        return "C";
      default:
        throw new Error(`Invalid pos: ${this._pos}`);
    }
  }

  // used for determining weight of getting subbed into game
  getSubOdds(): number {
    return Math.max(this.rating - 40, 10);
  }

  get idealPay(): number {
    return Math.pow(this.rating / 25, 3);
  }

  get contract(): Contract {
    return this._contract;
  }

  set contract(contract: Contract) {
    this._contract = contract;
  }

  get contractOptions(): number[] {
    const rand = Math.floor(Math.random() * 5);

    const idealPay = this.idealPay;

    const options: number[] = [];

    for (let i = 0; i < 5; i++) {
      const diff = Math.abs(rand - i);
      const addedPrice = Math.floor(Math.random() * 2e7 * diff);
      options.push(idealPay + addedPrice);
    }

    return options;
  }

  get age(): number {
    return this._age;
  }

  set retire(retire: (player: Player) => void) {
    this._retire = retire;
  }

  get seasonStats(): SeasonStats[] {
    return this._seasonStats;
  }

  get avgs(): number[][] {
    return this._seasonStats.map((season) => season.avg);
  }
}

export class SeasonStats {
  private _boxScores: BoxScore[];

  constructor(boxScores: BoxScore[]) {
    this._boxScores = boxScores;
  }

  add(box: BoxScore): void {
    this._boxScores.push(box);
  }

  get avg(): number[] {
    const avgs: number[] = zeros(BOX_SCORE_STATS);

    console.log(this._boxScores);

    this._boxScores.forEach((boxScore) => {
      for (let i = 0; i < boxScore.all.length; i++) {
        avgs[i] += boxScore.all[i] / this._boxScores.length;
      }
    });

    return avgs;
  }
}
