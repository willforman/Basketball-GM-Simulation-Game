import Player from "../player/Player";
import { Choice } from "../models/Choice";
import RandomSelector from "../services/RandomSelector";

export default class Roster {
  private positions: Position[];

  private genPlayerName: () => string;
  private getNextId: () => number; // increment player id number for league
  private retire: (player: Player) => void;

  constructor(genPlayerName: () => string, getNextId: () => number) {
    this.genPlayerName = genPlayerName;
    this.getNextId = getNextId;

    this.retire = (player: Player) => {
      this.remove(player);
    };

    this.positions = [];

    // create the position objs and gen players for them
    for (let i = 0; i < 5; i++) {
      const starter = new Player(
        this.genPlayerName(),
        this.getNextId(),
        i,
        this.retire
      );
      this.positions.push(new Position(starter));
    }

    // generate 10 random players and add them
    for (let i = 0; i < 10; i++) {
      const pos = Math.floor(Math.random() * 6);
      const player = new Player(
        this.genPlayerName(),
        this.getNextId(),
        pos,
        this.retire
      );
      this.add(player);
    }
  }

  add(player: Player): void {
    const pos = player.getPositionNum();

    const posObj = this.positions[pos];

    posObj.add(player);
  }

  get(pos: number): Player | null {
    if (0 > pos || 4 < pos) {
      throw new Error(`Invalid position given: ${pos}`);
    }
    return this.positions[pos].getStarter();
  }

  getBench(pos: number): Player[] {
    return this.positions[pos].getBench();
  }

  getStarters(): (Player | null)[] {
    return [
      this.positions[0].getStarter(),
      this.positions[1].getStarter(),
      this.positions[2].getStarter(),
      this.positions[3].getStarter(),
      this.positions[4].getStarter(),
    ];
  }

  getStartersNonNull(): Player[] {
    if (!this.isValid()) {
      console.error(
        this.positions.map((pos: Position) => pos.getStarter()?.getId())
      );
      throw new Error(`Can't get non null roster if roster has null spot`);
    }
    return [
      this.positions[0].getStarter()!,
      this.positions[1].getStarter()!,
      this.positions[2].getStarter()!,
      this.positions[3].getStarter()!,
      this.positions[4].getStarter()!,
    ];
  }

  getArray(): Player[] {
    return [
      ...this.positions[0].getAll(),
      ...this.positions[1].getAll(),
      ...this.positions[2].getAll(),
      ...this.positions[3].getAll(),
      ...this.positions[4].getAll(),
    ];
  }

  remove(player: Player): void {
    const pos = player.getPositionNum();

    this.positions[pos].remove(player);
  }

  // returns a new list of starters
  getSubs(): Player[] {
    return this.positions.map((pos: Position) => pos.getSub());
  }

  // determines if roster is empty at any position
  // can't start game if so
  isValid(): boolean {
    return !this.positions.some((pos: Position) => !pos.hasStarter());
  }

  calcValueIfAdded(player: Player): number {
    return this.positions[player.getPositionNum()].calcValueIfAdded(player);
  }
}

class Position {
  private starter: Player | null;

  private sortedPlayers: Player[];

  constructor(starter: Player) {
    this.starter = starter;
    this.sortedPlayers = [starter];
  }

  add(playerToAdd: Player): void {
    // insert into sorted players array at correct idx
    let found = false;
    this.sortedPlayers.forEach((player: Player, idx: number) => {
      if (!found && playerToAdd.playerComp(player) >= 0) {
        this.sortedPlayers.splice(idx, 0, playerToAdd);
        found = true;
      }
    });

    if (!found) {
      this.sortedPlayers.push(playerToAdd);
    }

    // add to starter spot if no starter
    if (!this.starter) {
      this.starter = playerToAdd;
    }
  }

  remove(player: Player): void {
    // remove player from sorted players
    const idxAt = this.sortedPlayers.indexOf(player);

    if (idxAt === -1) {
      throw new Error(`Given illegal player`);
    }

    this.sortedPlayers.splice(idxAt, 1);

    // remove player from starter spot or bench
    if (player === this.starter) {
      this.starter = null;
    }
  }

  getStarter(): Player | null {
    return this.starter;
  }

  getBench(): Player[] {
    return this.sortedPlayers.filter(
      (player: Player) => player !== this.starter
    );
  }

  getAll(): Player[] {
    return this.sortedPlayers;
  }

  getSub(): Player {
    const choices: Choice<Player>[] = this.getAll().map((player: Player) => ({
      item: player,
      weight: player.getSubOdds(),
    }));

    return new RandomSelector(choices).getChoice();
  }

  getIfEmpty(): boolean {
    return this.sortedPlayers.length === 0;
  }

  hasStarter(): boolean {
    return this.starter !== null;
  }

  calcValueIfAdded(player: Player): number {
    if (this.sortedPlayers.length === 0) {
      return player.getRating();
    }
    const topPlayerDiff = this.sortedPlayers[0].getRating() - 50;

    const sumOfRatings = this.sortedPlayers.reduce(
      (sum: number, curr: Player) => sum + curr.getRating(),
      0
    );

    return player.getRating() - (topPlayerDiff * 2 + sumOfRatings);
  }
}
