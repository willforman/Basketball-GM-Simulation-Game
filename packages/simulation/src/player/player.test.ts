import Player from "./Player";
import { getStats } from "./statGen";
import { Location } from "../models";
import { makePlayer } from "../testingObjs";

describe("Player", () => {
  const player = makePlayer();
  it("Is created", () => {
    expect(player).toBeTruthy();
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
  const statsGen = getStats(0, () => 60, 50);

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
