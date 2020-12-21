import { team1 } from "../testingObjs";

describe("Team", () => {
  const team = team1;

  it("Get player array", () => {
    const players = team.getPlayerArray();

    expect(players.length).toBe(team.getNumberOfPlayers());
  });

  it("Gets player by postion", () => {
    const player = team.getStarter(0);

    expect(player).toEqual(
      expect.objectContaining({
        pos: 0,
      })
    );
  });
});
