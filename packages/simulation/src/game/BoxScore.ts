import { Move } from "../models";

export default class BoxScore {
  private title: string;

  // stats tracked in game
  private points: number;
  private rebounds: number;
  private assists: number;
  private blocks: number;
  private steals: number;
  private FGAs: number;
  private FGMs: number;
  private threePtAs: number;
  private threePtMs: number;
  private FTAs: number;
  private FTMs: number;

  constructor(title: string) {
    this.title = title;

    this.points = this.rebounds = this.assists = this.blocks = this.steals = 0;
    this.FGAs = this.FGMs = this.threePtAs = this.threePtMs = this.FTAs = this.FTMs = 0;
  }

  addShot(move: string, points = 0): void {
    this.FGAs++;
    if (move === Move.THREE_PT_SHOT) {
      this.threePtAs++;
    }
    if (points > 0) {
      this.points += points;
      this.FGMs++;
      if (move === Move.THREE_PT_SHOT) {
        this.threePtMs++;
      }
    }
  }

  addAssist(): void {
    this.assists++;
  }

  addSteal(): void {
    this.steals++;
  }

  addBlock(): void {
    this.blocks++;
  }

  addRebound(): void {
    this.rebounds++;
  }
}
