export default class BoxScore {
  private completed: boolean;

  private title: string;

  // stats tracked in game
  private pointCount: number;
  private reboundCount: number;
  private assistCount: number;
  private blockCount: number;
  private stealCount: number;
  private FGACount: number;
  private FGMCount: number;
  private threePtACount: number;
  private threePtMCount: number;
  private FTACount: number;
  private FTMCount: number;

  constructor(title: string) {
    this.title = title;

    this.pointCount = this.reboundCount = this.assistCount = this.blockCount = this.stealCount = 0;
    this.FGACount = this.FGMCount = this.threePtACount = this.threePtMCount = this.FTACount = this.FTMCount = 0;

    this.completed = false;
  }
}
