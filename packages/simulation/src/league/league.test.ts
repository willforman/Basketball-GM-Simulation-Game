import { getId, genPlayerName, getTeamNames } from "../mockObjs";
import { genPlayoffsNextRound, getPlayoffTeams } from "./Playoffs";
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
  const team1 = new Team(getTeamNames(), genPlayerName, getId, 15);
  const team2 = new Team(getTeamNames(), genPlayerName, getId, 15);
  const team3 = new Team(getTeamNames(), genPlayerName, getId, 15);
  const team4 = new Team(getTeamNames(), genPlayerName, getId, 15);

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

  it("Gets playoff teams", () => {
    expect(getPlayoffTeams(teams).length).toBe(2);
  });

  it("Generates playoffs rounds", () => {
    const round = genPlayoffsNextRound(teams);

    expect(round).toBeTruthy();
  });
});
