import Team from "./Team";
import { Pick } from "../models";

export default class DraftPicks {
  private draftYears: DraftYear[];
  private team: Team;

  get GEN_PICKS_YEARS_AHEAD(): number {
    return 5;
  }

  constructor(team: Team) {
    this.team = team;

    this.draftYears = [];

    for (let i = 0; i < this.GEN_PICKS_YEARS_AHEAD; i++) {
      this.draftYears.push(new DraftYear(team));
    }
  }

  advanceYear(): void {
    if (this.draftYears.length !== this.GEN_PICKS_YEARS_AHEAD - 1) {
      throw new Error(`Invalid num of draft years: ${this.draftYears.length}`);
    }

    this.draftYears.push(new DraftYear(this.team));
  }

  changeOwnership(yearIdx: number, roundIdx: number, newTeam: Team): void {
    this.getPick(yearIdx, roundIdx).teamOwning = newTeam;
  }

  getPick(yearIdx: number, roundIdx: number): Pick {
    return this.getDraftYear(yearIdx).getPicks()[roundIdx];
  }

  getDraftYear(idx: number): DraftYear {
    return this.draftYears[idx];
  }

  getPicks(): Pick[] {
    const picks: Pick[] = [];

    this.draftYears.forEach((draftYear: DraftYear) => {
      picks.push(...draftYear.getPicks());
    });

    return picks;
  }

  getAndRemoveCurrYearPicks(): [Pick, Pick] {
    const draftYear = this.draftYears.shift();

    if (!draftYear) {
      throw new Error("Draft years array is empty");
    }

    return draftYear.getPicks();
  }
}

class DraftYear {
  private picks: Pick[];

  constructor(team: Team) {
    this.picks = [];

    for (let round = 1; round <= 2; round++) {
      this.picks.push({
        teamOwning: team,
        teamOrig: team,
        playerPicked: null,
      });
    }
  }

  getPicks(): [Pick, Pick] {
    return [this.picks[0], this.picks[1]];
  }
}
