import { getTeamNames, getId, genPlayerName } from "../mockObjs";
import Team from "../team/Team";

describe("Team", () => {
  const team = new Team(getTeamNames(), genPlayerName, getId, 15);

  it("Gets player by postion", () => {
    const player = team.getStarter(0);

    expect(player).toEqual(
      expect.objectContaining({
        pos: 0,
      })
    );
  });
});
