import { getTeamNames, getId, genPlayerName } from "../mockObjs";
import Team from "../team/Team";
import Player from "../player/Player";

const team = new Team(getTeamNames(), genPlayerName, getId, 15);

describe("Team", () => {
  it("Gets player by postion", () => {
    const pos = 0;
    const player = team.getStarter(pos);

    expect(player).toEqual(
      expect.objectContaining({
        pos,
      })
    );
  });
});

describe("Roster", () => {
  it("Subs lineup", () => {
    const roster = team.getRoster();

    const subs = roster.getSubs();

    const newPos = subs.map((player: Player) => player.getPositionNum());

    for (let i = 0; i < 5; i++) {
      expect(newPos[i]).toBe(i); // needs to be correct position
    }
  });
});
