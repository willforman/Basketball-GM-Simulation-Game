interface Pick {
  round: number;
  year: number;
}

export default class DraftPicks {
  private draftYears: DraftYear[];
  private currYear: number;

  get INIT_DRAFT_PICKS(): number {
    return 5;
  }

  constructor(currYear: number) {
    this.currYear = currYear;

    this.draftYears = [];

    for (let year = this.currYear; year < this.INIT_DRAFT_PICKS; year++) {
      this.draftYears.push(new DraftYear(year));
    }
  }

  addPick(year: number, pick: Pick): void {
    if (year < this.currYear || year > this.currYear + this.INIT_DRAFT_PICKS) {
      throw new Error(`Don't have picks yet for given year: ${year}`);
    }
    this.draftYears[year - this.currYear].addPick(pick);
  }
}

class DraftYear {
  private picks: Pick[];

  constructor(year: number) {
    this.picks = [];

    this.picks.push({
      round: 1,
      year,
    });

    this.picks.push({
      round: 2,
      year,
    });
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
