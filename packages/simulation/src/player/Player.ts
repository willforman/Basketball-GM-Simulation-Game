import { BoxScore } from "../game/BoxScore";
import { getStats } from "./statGen";
import { Move, Location, Archetype, Contract } from "../models";
import { Stats } from "./Stats";

export class Player {
  private _name: string;
  private _age: number;
  private _id: number;

  private _pos: number; // position, 0 = PG, 1 = SG, 2 = SF, 3 = PF, 4 = C
  private _archetype: Archetype; // determines type of player with stats

  private _potential: number;
  private _stats: Stats;

  private _contract: Contract;

  getLoc: () => Location;
  getMove: (loc: Location) => Move;

  private retire: (player: Player) => void;

  private boxScores: BoxScore[];

  constructor(
    name: string,
    id: number,
    pos: number,
    retire: (player: Player) => void,
    young?: boolean // boolean if player should be young
  ) {
    this._name = name;
    this._id = id;
    this.retire = retire;

    // if given valid position, use that, otherwise generate random one
    this._pos = 0 <= pos && pos <= 4 ? pos : this.getRand(0, 4);

    const ageUB = young ? 23 : 34;

    this._age = this.getRand(19, ageUB);

    // create potential that is higher
    this._potential =
      40 +
      this.getRand(0, 25) +
      this.getRand(0, ((33 - this._age) * 3 - 12) * ageBoolean(this._age));

    const rating =
      this._potential -
      this.getRand(0, ageBoolean(this._age) * (33 - this._age) * 3);

    this._id = id;

    this.boxScores = [];

    const archetypeNum = this._pos + this.getRand(0, 1);

    const { archetype, stats, getLocation, getMove } = getStats(
      archetypeNum,
      (): number => this._potential,
      rating
    );

    this._archetype = archetype;
    this.getLoc = getLocation;
    this.getMove = getMove;

    // assign stats from statgen
    this._stats = stats;

    this._contract = {
      price: this.idealPay,
      yearsLeft: Math.floor(Math.random() * 5) + 1,
    };
  }

  advanceYear(): void {
    this._age++;

    if (this.getRand(this._age - 31, 0) > 5) {
      this.retire(this);
    }

    this._contract.yearsLeft--;
  }

  private getRand(lb: number, ub: number): number {
    return Math.floor(Math.random() * (ub - lb + 1)) + lb;
  }

  goToNextYear(): void {
    this._age++;
    this.stats.updateStats();
  }

  addBoxScore(boxScore: BoxScore): void {
    this.boxScores.push(boxScore);
  }

  playerComp(player: Player): number {
    return this.rating - player.rating;
  }

  newContract(contract?: Contract): void {
    this._contract = contract ?? {
      yearsLeft: Math.floor(Math.random() * 6),
      price: this.idealPay,
    };
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

  getRatingMultiplier(): number {
    return this.rating / 100;
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
}

// returns 0 if age is over 33, 1 if not
function ageBoolean(age: number): number {
  return age <= 33 ? 1 : 0;
}
