import Team from "./Team";
import { Pick } from "../models";

export default class DraftPicks {
  private draftYears: DraftYear[];
  private currYear: number;
  private team: Team;

  get INIT_DRAFT_PICKS(): number {
    return 5;
  }

  constructor(team: Team, currYear: number) {
    this.team = team;
    this.currYear = currYear;

    this.draftYears = [];

    for (let year = this.currYear; year < this.INIT_DRAFT_PICKS; year++) {
      this.draftYears.push(new DraftYear(team));
    }
  }

  changeOwnership(pick: Pick, year: number, newTeam: Team): void {
    this.getDraftYear(year).changeOwnership(pick, newTeam);
  }

  getDraftYear(year: number): DraftYear {
    if (year < this.currYear || year > this.currYear + this.INIT_DRAFT_PICKS) {
      throw new Error(`Don't have picks yet for given year: ${year}`);
    }

    return this.draftYears[year - this.currYear];
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
      });
    }
  }

  changeOwnership(pickToChange: Pick, newTeam: Team): void {
    const foundPick = this.picks.find((pick: Pick) => pick === pickToChange);

    if (!foundPick) {
      throw new Error("Given pick couldn't be found");
    }

    foundPick.teamOwning = newTeam;
  }

  getPicks(): [Pick, Pick] {
    return [this.picks[0], this.picks[1]];
  }
}
