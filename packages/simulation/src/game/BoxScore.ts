import { Move } from "../models";

export class BoxScore {
  private _title: string;

  // stats tracked in game
  private _points: number;
  private _rebounds: number;
  private _assists: number;
  private _blocks: number;
  private _steals: number;
  private _FGAs: number;
  private _FGMs: number;
  private _threePtAs: number;
  private _threePtMs: number;
  private _FTAs: number;
  private _FTMs: number;

  constructor(title: string) {
    this._title = title;

    this._points = this._rebounds = this._assists = this._blocks = this._steals = 0;
    this._FGAs = this._FGMs = this._threePtAs = this._threePtMs = this._FTAs = this._FTMs = 0;
  }

  addShot(move: string, points = 0): void {
    this._FGAs++;
    if (move === Move.THREE_PT_SHOT) {
      this._threePtAs++;
    }
    if (points > 0) {
      this._points += points;
      this._FGMs++;
      if (move === Move.THREE_PT_SHOT) {
        this._threePtMs++;
      }
    }
  }

  get FGA(): number {
    return this._FGAs;
  }

  addPoints(num: number): void {
    this._points += num;
  }

  addRebounds(num: number): void {
    this._rebounds += num;
  }

  addAssists(num: number): void {
    this._assists += num;
  }

  addBlocks(num: number): void {
    this._blocks += num;
  }

  addSteals(num: number): void {
    this._steals += num;
  }

  addFGAs(num: number): void {
    this._FGAs += num;
  }

  addFGMs(num: number): void {
    this._FGMs += num;
  }

  addThreePtAs(num: number): void {
    this._threePtAs += num;
  }

  addThreePtMs(num: number): void {
    this._threePtMs += num;
  }

  addFTAs(num: number): void {
    this._FTAs += num;
  }

  addFTMs(num: number): void {
    this._FTMs += num;
  }

  get all(): number[] {
    return [
      this._points,
      this._rebounds,
      this._assists,
      this._blocks,
      this._steals,
      this._FGAs,
      this._FGMs,
      this._threePtAs,
      this._threePtMs,
      this._FTAs,
      this._FTMs,
    ];
  }
}
