import BoxScore from "../game/BoxScore";
import { getStats } from "./statGen";
import { Move, Location } from "../models";
import Stats from "./Stats";

export default class Player {
  private name: string;
  private age: number;
  private id: number;

  private pos: number; // position, 0 = PG, 1 = SG, 2 = SF, 3 = PF, 4 = C
  private archetype: string; // determines type of player with stats

  private rating: number;
  private potential: number;
  private stats: Stats;

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
    this.name = name;
    this.id = id;
    this.retire = retire;

    // if given valid position, use that, otherwise generate random one
    this.pos = 0 <= pos && pos <= 4 ? pos : this.getRand(0, 4);

    const ageUB = young ? 23 : 34;

    this.age = this.getRand(19, ageUB);

    // create potential that is higher
    this.potential =
      40 +
      this.getRand(0, 25) +
      this.getRand(0, ((33 - this.age) * 3 - 12) * ageBoolean(this.age));

    this.rating =
      this.potential -
      this.getRand(0, ageBoolean(this.age) * (33 - this.age) * 3);

    this.id = id;

    this.boxScores = [];

    const archetypeNum = this.pos + this.getRand(0, 1);

    const { archetype, stats, getLocation, getMove } = getStats(
      archetypeNum,
      this.getPotential,
      this.rating
    );

    this.archetype = archetype;
    this.getLoc = getLocation;
    this.getMove = getMove;

    // assign stats from statgen
    this.stats = stats;
  }

  advanceYear(): void {
    this.age++;

    if (this.getRand(this.age - 31, 0) > 5) {
      this.retire(this);
    }
  }

  private getRand(lb: number, ub: number): number {
    return Math.floor(Math.random() * (ub - lb + 1)) + lb;
  }

  goToNextYear(): void {
    this.age++;
    this.stats.updateStats();
  }

  addBoxScore(boxScore: BoxScore): void {
    this.boxScores.push(boxScore);
  }

  playerComp(player: Player): number {
    return this.rating - player.getRating();
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

  getPotential(): number {
    return this.potential;
  }

  getRating(): number {
    return this.rating;
  }

  getRatingMultiplier(): number {
    return this.rating / 100;
  }

  getPositionNum(): number {
    return this.pos;
  }

  // used for determining weight of getting subbed into game
  getSubOdds(): number {
    return Math.min(this.rating - 40, 10);
  }
}

// returns 0 if age is over 33, 1 if not
function ageBoolean(age: number): number {
  return age <= 33 ? 1 : 0;
}
