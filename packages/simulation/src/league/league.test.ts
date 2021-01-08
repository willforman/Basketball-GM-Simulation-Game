import { getId, genPlayerName, getTeamNames } from "../mockObjs";
import { genPlayoffsNextRound } from "./Playoffs";
import { genRegularSeasonGames } from "./RegularSeason";
import Game from "../game/Game";
import League from "./League";
import Team from "../team/Team";

describe("League", () => {
  const league = new League(genPlayerName, getTeamNames);

  it("Find team by location", () => {
    // test league has all teams with location of "test location"
    const team = league.getTeamByLocation("Test Location");

    expect(team).toBeTruthy();
  });

  it("Simulates season", () => {
    league.simWeek();
    league.simSeason();

    expect(league.getRegularSeason().getCompleted()).toBeTruthy();
  });

  it("Simulates playoffs", () => {
    league.advToPlayoffs();

    league.simPlayoffRound();
    league.simAllPlayoffs();
    expect(league.getWinner()).toBeTruthy();
  });

  it("Simulates draft", () => {
    league.advToDraft();

    league.simDraft();
  });

  it("Simulates free agency", () => {
    league.advToFreeAgency();

    league.simFreeAgency();
  });
});

describe("Game Scheduling", () => {
  const team1 = new Team(getTeamNames(), genPlayerName, getId);
  const team2 = new Team(getTeamNames(), genPlayerName, getId);
  const team3 = new Team(getTeamNames(), genPlayerName, getId);
  const team4 = new Team(getTeamNames(), genPlayerName, getId);

  const teams = [team1, team2, team3, team4];
  it("Generates regular season", () => {
    const games = genRegularSeasonGames(teams);

    let count = 0;
    games.forEach((week: Game[]) => {
      week.forEach((game: Game) => {
        expect(game).toBeTruthy();
        count++;
      });
    });

    expect(count).toBe(6);
  });

  it("Generates playoffs rounds", () => {
    const round = genPlayoffsNextRound(teams);

    expect(round).toBeTruthy();
  });
});
