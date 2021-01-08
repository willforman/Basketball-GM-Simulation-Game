import Game from "../game/Game";
import Team from "../team/Team";

// round robin tournament algorithm
export const genRegularSeasonGames = (teamsPassed: Team[]): Game[][] => {
  const games: Game[][] = [];

  // copy the teams given but remove the first team, and save it
  const copyTeams = teamsPassed.filter((team: Team, idx: number) => idx !== 0);
  const removedTeam = teamsPassed[0];

  // will require number of teams - 1 to complete round robin
  for (let week = 0; week < teamsPassed.length - 1; week++) {
    const gamesThisWeek: Game[] = [];
    games.push(gamesThisWeek);

    const teamIdx = week % copyTeams.length;

    const g1 = new Game(copyTeams[teamIdx], removedTeam, teamIdx);
    gamesThisWeek.push(g1);

    removedTeam.addGame(g1);
    copyTeams[teamIdx].addGame(g1);

    for (let i = 1; i < (copyTeams.length + 1) / 2; i++) {
      const firstIdx = (week + 1) % copyTeams.length;
      const secondIdx = (week + copyTeams.length - 1) % copyTeams.length;

      const g2 = new Game(copyTeams[firstIdx], copyTeams[secondIdx], teamIdx);
      gamesThisWeek.push(g2);

      copyTeams[firstIdx].addGame(g2);
      copyTeams[secondIdx].addGame(g2);
    }
  }

  return games;
};

export default class RegularSeason {
  private weeks: Week[];
  private weekIdx: number;

  private completed: boolean;

  constructor(teams: Team[]) {
    const gamesMatrix = genRegularSeasonGames(teams);
    this.weeks = gamesMatrix.map((games: Game[]) => new Week(games));

    this.weekIdx = 0;
    this.completed = false;
  }

  simulateWeek(): void {
    if (this.completed) {
      throw new Error("Season already completed");
    }

    this.weeks[this.weekIdx].simulate();
    this.weekIdx++;

    if (this.weekIdx === this.weeks.length) {
      this.completed = true;
    }
  }

  simulateAll(): void {
    if (this.completed) {
      throw new Error("Season already completed");
    }

    for (let week = this.weekIdx; week < this.weeks.length; week++) {
      this.simulateWeek();
    }
  }

  getCompleted(): boolean {
    return this.completed;
  }
}

class Week {
  private games: Game[];
  private completed: boolean;

  constructor(games: Game[]) {
    this.games = games;
    this.completed = false;
  }

  simulate(): void {
    if (this.completed) {
      throw new Error("Week has already been completed");
    }
    this.games.forEach((game: Game) => game.simulate());
    this.completed = true;
  }
}
