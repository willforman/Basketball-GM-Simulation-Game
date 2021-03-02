import Player from "../player/Player";
import Game from "../game/Game";
import { TeamNames, Pick, MAX_CAP } from "../models";
import Roster from "./Roster";
import DraftPicks from "./DraftPicks";
import CapSpace from "./CapSpace";

export default class Team {
  private _name: string;
  private _location: string;
  private _abbreviation: string;

  private _wins: number;
  private _losses: number;

  private _roster: Roster;
  private _games: Game[];

  private _picks: DraftPicks;
  private _cap: CapSpace;

  get ROSTER_SIZE(): number {
    return 15;
  }

  constructor(
    names: TeamNames,
    genPlayerName: () => string,
    getNextId: () => number
  ) {
    this._name = names.name;
    this._location = names.location;
    this._abbreviation = names.abbreviation;

    this._wins = 0;
    this._losses = 0;

    this._games = [];

    this._roster = new Roster(genPlayerName, getNextId);

    this._picks = new DraftPicks(this);
    const currPay = this._roster.allPlayers.reduce(
      (tot: number, player: Player) => tot + player.contract.price,
      0
    );
    this._cap = new CapSpace(currPay, MAX_CAP);
  }

  advanceYear(): void {
    this._roster.advanceYear();
  }

  addGame(game: Game): void {
    this._games.push(game);
  }

  addPlayer(player: Player): void {
    this._roster.add(player);
  }

  removePlayer(player: Player): void {
    this._roster.remove(player);
  }

  evaluatePlayer(player: Player): number {
    return this._roster.calcValueIfAdded(player);
  }

  pickPlayer(players: Player[]): Player {
    let maxValue = Number.MIN_SAFE_INTEGER;
    let maxPlayer: Player;

    players.forEach((player: Player) => {
      const value = this.evaluatePlayer(player);
      const randValue = value + Math.floor(Math.random() * (value / 2));

      if (randValue > maxValue) {
        maxValue = randValue;
        maxPlayer = player;
      }
    });

    return maxPlayer!;
  }

  // get methods
  getPicks(): [Pick, Pick] {
    return this._picks.getAndRemoveCurrYearPicks();
  }

  get roster(): Roster {
    return this._roster;
  }

  get abreviation(): string {
    return this._abbreviation;
  }

  get location(): string {
    return this._location;
  }

  get wins(): number {
    return this._wins;
  }

  get losses(): number {
    return this._losses;
  }

  get name(): string {
    return this._name;
  }
}
