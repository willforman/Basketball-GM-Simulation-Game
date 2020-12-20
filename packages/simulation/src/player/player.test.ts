import { player } from "../testingObjs";
import Player from "./Player";
import { getStats } from "./statGen";

describe("Player", () => {
  it("Is created", () => {
    const createdPlayer = new Player("Joe Smith", 1, 0);
    expect(createdPlayer).toEqual(
      expect.objectContaining({
        name: "Joe Smith",
        pos: 0,
        id: 1,
      })
    );
  });
  it("Get location", () => {
    const loc = player.getLoc();
    expect(loc).toBeTruthy();
  });
  it("Get move", () => {
    const testLoc = "paint";
    const move = player.getMove(testLoc);
    expect(move).toBeTruthy();
  });
});

describe("StatsGen", () => {
  const statsGen = getStats(0);

  it("Outputs correctly", () => {
    expect(statsGen).toEqual(
      expect.objectContaining({
        archetype: "Playmaker",
      })
    );
  });

  it("Gets location", () => {
    expect(statsGen.getLocation()).toBeTruthy();
  });

  it("Gets move at location", () => {
    const loc = "paint";

    expect(statsGen.getMove(loc)).toBeTruthy();
  });
});
