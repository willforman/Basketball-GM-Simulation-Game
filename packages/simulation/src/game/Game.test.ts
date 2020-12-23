import Player from "../player/Player";
import { genPlayerName, getId, getTeamNames } from "../mockObjs";
import BoxScore from "./BoxScore";
import Game from "./Game";
import Team from "../team/Team";

describe("Game", () => {
  const team1 = new Team(getTeamNames(), genPlayerName, getId, 15);
  const team2 = new Team(getTeamNames(), genPlayerName, getId, 15);
  const game = new Game(team1, team2, 0);
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

    const origIds = roster
      .getStarters()
      .map((player: Player) => player.getId());

    const newIds = roster.getSubs().map((player: Player) => player.getId());

    for (let i = 0; i < 5; i++) {
      if (roster.getBench(i).length !== 0) {
        expect(newIds[i]).not.toBe(origIds[i]);
      }
    }
  });
});
