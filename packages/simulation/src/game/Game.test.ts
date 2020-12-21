import Player from "../player/Player";
import { game, team1 } from "../testingObjs";
import BoxScore from "./BoxScore";
import { subLineup } from "./Game";

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

    console.log(`${homeScore} - ${awayScore}`);

    expect(homeScore).toBeGreaterThan(0);
    expect(awayScore).toBeGreaterThan(0);
  });

  it("Subs lineup", () => {
    const roster = team1.getRoster();

    const origIds = roster.starters.map((player: Player) => player.getId());

    subLineup(roster);

    const subbedIds = roster.starters.map((player: Player) => player.getId());

    for (let i = 0; i < 5; i++) {
      if (roster.bench[i].length !== 0) {
        expect(subbedIds[i]).not.toBe(origIds[i]);
      }
    }
  });
});
