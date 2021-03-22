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

  addAssist(): void {
    this._assists++;
  }

  addSteal(): void {
    this._steals++;
  }

  addBlock(): void {
    this._blocks++;
  }

  addRebound(): void {
    this._rebounds++;
  }

  get FGA(): number {
    return this._FGAs;
  }
}
