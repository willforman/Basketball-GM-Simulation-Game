import Player from "../player/Player";
import Game from "../game/Game";
import { TeamNames, Pick } from "../models";
import Roster from "./Roster";
import DraftPicks from "./DraftPicks";

export default class Team {
  private name: string;
  private location: string;
  private abbreviation: string;

  private wins: number;
  private losses: number;

  private roster: Roster;
  private games: Game[];

  private picks: DraftPicks;

  get ROSTER_SIZE(): number {
    return 15;
  }

  constructor(
    names: TeamNames,
    genPlayerName: () => string,
    getNextId: () => number
  ) {
    this.name = names.name;
    this.location = names.location;
    this.abbreviation = names.abbreviation;

    this.wins = 0;
    this.losses = 0;

    this.games = [];

    this.roster = new Roster(genPlayerName, getNextId);

    this.picks = new DraftPicks(this);
  }

  advanceYear(): void {
    this.getPlayerArray().forEach((player: Player) => {
      player.advanceYear();
    });
  }

  addGame(game: Game): void {
    this.games.push(game);
  }

  addPlayer(player: Player): void {
    this.roster.add(player);
  }

  removePlayer(player: Player): void {
    this.roster.remove(player);
  }

  evaluatePlayer(player: Player): number {
    return this.roster.calcValueIfAdded(player);
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
    return this.picks.getAndRemoveCurrYearPicks();
  }

  getRoster(): Roster {
    return this.roster;
  }

  getAbreviation(): string {
    return this.abbreviation;
  }

  getStarter(pos: number): Player | null {
    return this.roster.get(pos);
  }

  getPlayerArray(): Player[] {
    return this.roster.getArray();
  }

  getLocation(): string {
    return this.location;
  }

  getWins(): number {
    return this.wins;
  }

  getLosses(): number {
    return this.losses;
  }
}
