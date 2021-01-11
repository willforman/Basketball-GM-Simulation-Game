import Team from "./Team";
import { Pick } from "../models";

export default class DraftPicks {
  private _draftYears: DraftYear[];
  private _team: Team;

  get GEN_PICKS_YEARS_AHEAD(): number {
    return 5;
  }

  constructor(team: Team) {
    this._team = team;

    this._draftYears = [];

    for (let i = 0; i < this.GEN_PICKS_YEARS_AHEAD; i++) {
      this._draftYears.push(new DraftYear(team));
    }
  }

  advanceYear(): void {
    if (this._draftYears.length !== this.GEN_PICKS_YEARS_AHEAD - 1) {
      throw new Error(`Invalid num of draft years: ${this._draftYears.length}`);
    }

    this._draftYears.forEach((year: DraftYear) => year.advanceYear());

    this._draftYears.push(new DraftYear(this._team));
  }

  changeOwnership(yearIdx: number, roundIdx: number, newTeam: Team): void {
    this.getPick(yearIdx, roundIdx).teamOwning = newTeam;
  }

  getPick(yearIdx: number, roundIdx: number): Pick {
    return this.getDraftYear(yearIdx).picks[roundIdx];
  }

  getDraftYear(idx: number): DraftYear {
    return this._draftYears[idx];
  }

  get picks(): Pick[] {
    const picks: Pick[] = [];

    this._draftYears.forEach((draftYear: DraftYear) => {
      picks.push(...draftYear.picks);
    });

    return picks;
  }

  getAndRemoveCurrYearPicks(): [Pick, Pick] {
    const draftYear = this._draftYears.shift();

    if (!draftYear) {
      throw new Error("Draft years array is empty");
    }

    return draftYear.picks;
  }
}

class DraftYear {
  private _picks: Pick[];

  constructor(team: Team, yearsAwayGiven?: number) {
    this._picks = [];

    const yearsAway = yearsAwayGiven ?? 4;

    for (let round = 1; round <= 2; round++) {
      this._picks.push({
        teamOwning: team,
        teamOrig: team,
        playerPicked: null,
        round,
        yearsAway,
      });
    }
  }

  get picks(): [Pick, Pick] {
    return [this._picks[0], this._picks[1]];
  }

  advanceYear(): void {
    this._picks.forEach((pick: Pick) => pick.yearsAway--);
  }
}
