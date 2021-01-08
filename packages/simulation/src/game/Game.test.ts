import Player from "../player/Player";
import { genPlayerName, getId, getTeamNames } from "../mockObjs";
import BoxScore from "./BoxScore";
import Game from "./Game";
import Team from "../team/Team";

describe("Game", () => {
  const team1 = new Team(getTeamNames(), genPlayerName, getId);
  const team2 = new Team(getTeamNames(), genPlayerName, getId);
  const game = new Game(team1, team2, 0);
  it("Simulates", () => {
    game.simulate();

    const [homeScore, awayScore] = game.getScores();

    // const [homeMap, awayMap] = game.getBoxScoresMap();

    // Array.from(homeMap.entries()).forEach((map: [Player, BoxScore]) => {
    //   console.log(`Archetype: ${map[0].getArchetype()}`);
    //   console.log(map[1]);
    // });

    console.log(`${homeScore} - ${awayScore}`);

    expect(homeScore).toBeGreaterThan(0);
    expect(awayScore).toBeGreaterThan(0);
  });
});
