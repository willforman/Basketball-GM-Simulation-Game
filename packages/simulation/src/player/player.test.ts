import { retire } from "../mockObjs";
import Player from "./Player";
import { getStats } from "./statGen";
import { Location } from "../models";

describe("Player", () => {
  const player = new Player("Test Player", 0, 1, retire);
  it("Is created", () => {
    expect(player).toEqual(
      expect.objectContaining({
        name: "Test Player",
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
    const move = player.getMove(Location.PAINT);
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
    expect(statsGen.getMove(Location.PAINT)).toBeTruthy();
  });
});
