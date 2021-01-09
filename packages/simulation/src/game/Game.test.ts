import { genPlayerName, getId, getTeamNames } from "../mockObjs";
import Game from "./Game";
import Team from "../team/Team";

describe("Game", () => {
  const team1 = new Team(getTeamNames(), genPlayerName, getId);
  const team2 = new Team(getTeamNames(), genPlayerName, getId);
  const game = new Game(team1, team2, 0);
  it("Simulates", () => {
    game.simulate();

    const [homeScore, awayScore] = game.getScores();

    expect(homeScore).toBeGreaterThan(0);
    expect(awayScore).toBeGreaterThan(0);
  });

  it("Box scores are correct", () => {
    const boxScore = game.getBoxScores()[0];

    expect(boxScore.getFGA()).toBeGreaterThan(0);
  });
});
