import Team from "../team/Team";
import { game } from "../testingObjs";

describe("Game", () => {
  it("Creates game", () => {
    expect(game).toBeTruthy();
  });

  it("Simulates", () => {
    game.simulate();

    const [homeScore, awayScore] = game.getScores();

    console.log(game.getBoxScores());

    expect(homeScore).toBeGreaterThan(0);
    expect(awayScore).toBeGreaterThan(0);
  });
});
