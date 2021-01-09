import { makeGame, makeTeam } from "../testingObjs";

describe("Game", () => {
  const team1 = makeTeam();
  const team2 = makeTeam();
  const game = makeGame(team1, team2);

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
