import { Game } from "../game/Game";
import { Team } from "../team/Team";
import { roundRobin } from "./scheduleGames";

export class RegularSeason {
  private _weeks: Week[];
  private _weekIdx: number;

  private _completed: boolean;

  private _triggerTrades: () => void;

  constructor(teams: Team[], triggerTrades: () => void) {
    this._triggerTrades = triggerTrades;

    const gamesMatrix = roundRobin(teams);
    this._weeks = gamesMatrix.map((games: Game[]) => new Week(games));

    this._weekIdx = 0;
    this._completed = false;
  }

  simWeek(): void {
    if (this._completed) {
      throw new Error("Season already completed");
    }

    this._weeks[this._weekIdx].simulate();
    this._weekIdx++;

    // teams trade on odd weeks first half of season
    if (this._weekIdx <= this._weeks.length / 2 && this._weekIdx % 1 === 0) {
      this._triggerTrades();
    }

    if (this._weekIdx === this._weeks.length) {
      this._completed = true;
    }
  }

  simAll(): void {
    if (this._completed) {
      throw new Error("Season already completed");
    }

    for (let week = this._weekIdx; week < this._weeks.length; week++) {
      this.simWeek();
    }
  }

  get completed(): boolean {
    return this._completed;
  }

  get weekIdx(): number {
    return this._weekIdx;
  }

  getWeekGames(weekIdx: number): Game[] {
    return this._weeks[weekIdx].games;
  }
}

class Week {
  private _games: Game[];
  private _completed: boolean;

  constructor(games: Game[]) {
    this._games = games;
    this._completed = false;
  }

  simulate(): void {
    if (this._completed) {
      throw new Error("Week has already been completed");
    }
    this._games.forEach((game: Game) => game.sim());
    this._completed = true;
  }

  get completed(): boolean {
    return this._completed;
  }

  get games(): Game[] {
    return this._games;
  }
}
