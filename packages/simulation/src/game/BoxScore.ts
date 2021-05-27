import { Move, BOX_SCORE_STATS } from "../models";
import { zeros } from "../services/funcs";

export class BoxScore {
  private _title: string;

  // stats tracked in game
  private _all: number[];

  constructor(title: string) {
    this._title = title;
    this._all = zeros(BOX_SCORE_STATS);
  }

  get points(): number {
    return this._all[0];
  }

  get rebounds(): number {
    return this._all[1];
  }

  get assists(): number {
    return this._all[2];
  }

  get blocks(): number {
    return this._all[3];
  }

  get steals(): number {
    return this._all[4];
  }

  get FGAs(): number {
    return this._all[5];
  }

  get FGMs(): number {
    return this._all[6];
  }

  get threePtAs(): number {
    return this._all[7];
  }

  get threePtMs(): number {
    return this._all[8];
  }

  get FTAs(): number {
    return this._all[9];
  }

  get FTMs(): number {
    return this._all[10];
  }

  get mins(): number {
    return this._all[11];
  }

  get all(): number[] {
    return this._all;
  }

  addShot(move: Move, points = 0): void {
    this._all[5]++;
    if (move === Move.THREE_PT_SHOT) {
      this._all[7]++;
    }
    if (points > 0) {
      this._all[0] += points;
      this._all[6]++;
      if (move === Move.THREE_PT_SHOT) {
        this._all[8]++;
      }
    }
  }

  addPoints(num: number): void {
    this._all[0] += num;
  }

  addRebounds(num: number): void {
    this._all[1] += num;
  }

  addAssists(num: number): void {
    this._all[2] += num;
  }

  addBlocks(num: number): void {
    this._all[3] += num;
  }

  addSteals(num: number): void {
    this._all[4] += num;
  }

  addFGAs(num: number): void {
    this._all[5] += num;
  }

  addFGMs(num: number): void {
    this._all[6] += num;
  }

  addThreePtAs(num: number): void {
    this._all[7] += num;
  }

  addThreePtMs(num: number): void {
    this._all[8] += num;
  }

  addFTAs(num: number): void {
    this._all[9] += num;
  }

  addFTMs(num: number): void {
    this._all[10] += num;
  }

  addMins(num: number): void {
    this._all[11] += num;
  }

  add(box: BoxScore): void {
    for (let i = 0; i < this._all.length; i++) {
      this._all[i] += box.all[i];
    }
  }
}
