import Player from "../player/Player";
import { game } from "../testingObjs";
import BoxScore from "./BoxScore";

describe("Game", () => {
  it("Creates game", () => {
    expect(game).toBeTruthy();
  });

  it("Simulates", () => {
    game.simulate();

    const [homeScore, awayScore] = game.getScores();

    const [homeMap, awayMap] = game.getBoxScoresMap();

    Array.from(homeMap.entries()).forEach((map: [Player, BoxScore]) => {
      console.log(`Archetype: ${map[0].getArchetype()}`);
      console.log(map[1]);
    });

    expect(homeScore).toBeGreaterThan(0);
    expect(awayScore).toBeGreaterThan(0);
  });
});
