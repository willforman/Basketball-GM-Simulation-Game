import Team from "./Team";

interface Pick {
  round: number;
  team: Team;
}

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

  addPick(pick: Pick, year: number): void {
    this.getDraftYear(year).addPick(pick);
  }

  removePick(pick: Pick, year: number): void {
    this.getDraftYear(year).removePick(pick);
  }

  getDraftYear(year: number): DraftYear {
    if (year < this.currYear || year > this.currYear + this.INIT_DRAFT_PICKS) {
      throw new Error(`Don't have picks yet for given year: ${year}`);
    }

    return this.draftYears[year - this.currYear];
  }

  getAndRemoveCurrYear(): DraftYear {
    const draftYear = this.draftYears.shift();

    if (!draftYear) {
      throw new Error("Draft years array is empty");
    }

    return draftYear;
  }
}

class DraftYear {
  private picks: Pick[];

  constructor(team: Team) {
    this.picks = [];

    for (let round = 1; round <= 2; round++) {
      this.picks.push({
        round,
        team,
      });
    }
  }

  addPick(pick: Pick): void {
    this.picks.push(pick);
  }

  removePick(pick: Pick): void {
    const idx = this.picks.indexOf(pick);

    if (idx !== -1) {
      throw new Error("Team doesn't have this pick");
    }

    this.picks.splice(idx, 1);
  }
}
