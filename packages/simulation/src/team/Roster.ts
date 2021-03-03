import Player from "../player/Player";
import { Choice } from "../models/Choice";
import RandomSelector from "../services/RandomSelector";
import { mapPlayerIds } from "../services/funcs";

export default class Roster {
  // 0: PG
  // 1: SG
  // 2: SF
  // 3: PF
  // 4: C
  private _positions: Position[];

  private _genPlayerName: () => string;
  private _getNextId: () => number; // increment player id number for league
  private _retire: (player: Player) => void;

  constructor(genPlayerName: () => string, getNextId: () => number) {
    this._genPlayerName = genPlayerName;
    this._getNextId = getNextId;

    this._retire = (player: Player): void => this.remove(player);

    this._positions = [];

    // create the position objs and gen players for them
    for (let i = 0; i < 5; i++) {
      const starter = new Player(
        this._genPlayerName(),
        this._getNextId(),
        i,
        this._retire
      );
      this._positions.push(new Position(starter));
    }

    // generate 10 random players and add them
    for (let i = 0; i < 10; i++) {
      const pos = Math.floor(Math.random() * 6);
      const player = new Player(
        this._genPlayerName(),
        this._getNextId(),
        pos,
        this._retire
      );
      this.add(player);
    }
  }

  advanceYear(): void {
    this.allPlayers.forEach((p: Player) => p.advanceYear());
  }

  add(player: Player): void {
    this._positions[player.pos].add(player);
  }

  addMultiple(players: Player[]): void {
    players.forEach((player: Player) => this.add(player));
  }

  get(pos: number): Player | null {
    if (0 > pos || 4 < pos) {
      throw new Error(`Invalid position given: ${pos}`);
    }
    return this._positions[pos].starter;
  }

  getBench(pos: number): Player[] {
    return this._positions[pos].bench;
  }

  getStarters(): (Player | null)[] {
    return [
      this._positions[0].starter,
      this._positions[1].starter,
      this._positions[2].starter,
      this._positions[3].starter,
      this._positions[4].starter,
    ];
  }

  getStartersNonNull(): Player[] {
    if (!this.isValid()) {
      console.error(this._positions.map((pos: Position) => pos.starter?.id));
      throw new Error(`Can't get non null roster if roster has null spot`);
    }
    return [
      this._positions[0].starter!,
      this._positions[1].starter!,
      this._positions[2].starter!,
      this._positions[3].starter!,
      this._positions[4].starter!,
    ];
  }

  get allPlayers(): Player[] {
    return [
      ...this._positions[0].allPlayers,
      ...this._positions[1].allPlayers,
      ...this._positions[2].allPlayers,
      ...this._positions[3].allPlayers,
      ...this._positions[4].allPlayers,
    ];
  }

  remove(player: Player): void {
    this._positions[player.pos].remove(player);
  }

  removeMultiple(players: Player[]): void {
    players.forEach((player: Player) => this.remove(player));
  }

  // returns a new list of starters
  getSubs(): Player[] {
    return this._positions.map((pos: Position) => pos.getSub());
  }

  // determines if roster is empty at any position
  // can't start game if so
  isValid(): boolean {
    return !this._positions.some((pos: Position) => !pos.hasStarter());
  }

  calcValueIfAdded(player: Player): number {
    return this._positions[player.pos].calcValueIfAdded(player);
  }

  get playersToRenew(): Player[] {
    return this.allPlayers.filter(
      (player: Player) => player.contract.yearsLeft === 0
    );
  }

  get size(): number {
    return this._positions.reduce(
      (tot: number, curr: Position) => tot + curr.allPlayers.length,
      0
    );
  }
}

class Position {
  private _starter: Player | null;

  private _sortedPlayers: Player[];

  constructor(starter: Player) {
    this._starter = starter;
    this._sortedPlayers = [starter];
  }

  add(playerToAdd: Player): void {
    // insert into sorted players array at correct idx
    let found = false;
    this._sortedPlayers.forEach((player: Player, idx: number) => {
      if (!found && playerToAdd.playerComp(player) >= 0) {
        this._sortedPlayers.splice(idx, 0, playerToAdd);
        found = true;
      }
    });

    if (!found) {
      this._sortedPlayers.push(playerToAdd);
    }

    // add to starter spot if no starter
    if (!this._starter) {
      this._starter = playerToAdd;
    }
  }

  remove(player: Player): void {
    // remove player from sorted players
    const idxAt = this._sortedPlayers.indexOf(player);

    if (idxAt === -1) {
      throw new Error(
        `Given player ${player.id} isn't in ${mapPlayerIds(
          this._sortedPlayers
        )}`
      );
    }

    this._sortedPlayers.splice(idxAt, 1);

    // remove player from starter spot or bench
    if (player === this._starter) {
      this._starter = null;
    }
  }

  get starter(): Player | null {
    return this._starter;
  }

  get bench(): Player[] {
    return this._sortedPlayers.filter(
      (player: Player) => player !== this._starter
    );
  }

  get allPlayers(): Player[] {
    return this._sortedPlayers;
  }

  getSub(): Player {
    const choices: Choice<Player>[] = this.allPlayers.map((player: Player) => ({
      item: player,
      weight: player.getSubOdds(),
    }));

    return new RandomSelector(choices).getChoice();
  }

  get isEmpty(): boolean {
    return this._sortedPlayers.length === 0;
  }

  hasStarter(): boolean {
    return this.starter !== null;
  }

  calcValueIfAdded(playerToCalc: Player): number {
    if (
      this._sortedPlayers.length === 0 ||
      (this._sortedPlayers.length === 1 &&
        this._sortedPlayers[0] === playerToCalc)
    ) {
      return playerToCalc.rating * 2;
    }

    // in order to calculate value of player already on roster
    const playersFiltered = this._sortedPlayers.filter(
      (player: Player) => player !== playerToCalc
    );

    const sumOfRatings = playersFiltered.reduce(
      (sum: number, curr: Player) => sum + curr.rating,
      0
    );

    // gets highest rated player for this position besides the player to calculate
    const highestRating = this._sortedPlayers[
      playerToCalc !== this._sortedPlayers[0] ? 0 : 1
    ].rating;

    const avgRating =
      (sumOfRatings + highestRating) / (playersFiltered.length + 1);

    return playerToCalc.rating * 2 - avgRating;
  }

  get playersToRenew(): Player[] {
    return this._sortedPlayers.filter(
      (player: Player) => player.contract.yearsLeft === 0
    );
  }

  get highestRated(): Player | null {
    if (this._sortedPlayers.length === 0) {
      return null;
    }
    return this._sortedPlayers[0];
  }
}
