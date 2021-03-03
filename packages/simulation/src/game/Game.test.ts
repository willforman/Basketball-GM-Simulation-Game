import { makeGame, makeTeam } from "../testingObjs/testingObjs";

describe("Game", () => {
  const team1 = makeTeam();
  const team2 = makeTeam();
  const game = makeGame(team1, team2);

  it("Simulates", () => {
    game.sim();

    const [homeScore, awayScore] = game.scores;

    expect(homeScore).toBeGreaterThan(0);
    expect(awayScore).toBeGreaterThan(0);
  });

  it("Box scores are correct", () => {
    const boxScore = game.boxScores[0];

    expect(boxScore.FGA).toBeGreaterThan(0);
  });
});
