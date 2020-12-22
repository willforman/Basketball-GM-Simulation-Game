import { league, team1, team2, team3, team4 } from "../testingObjs";

import { genPlayoffsNextRound, getPlayoffTeams } from "./Playoffs";
import { genRegularSeasonGames } from "./RegularSeason";

import Game from "../game/Game";

describe("League", () => {
  it("Find team by location", () => {
    // test league has all teams with location of "test location"
    const team = league.getTeamByLocation("Test Location");

    expect(team).toBeTruthy();
  });

  it("Simulates season", () => {
    league.simulateWeek();
    league.simulateSeason();
  });

  it("Simulates playoffs", () => {
    league.initPlayoffs();

    league.simulateAllPlayoffs();
    expect(league.getWinner()).toBeTruthy();
  });
});

describe("Game Scheduling", () => {
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
