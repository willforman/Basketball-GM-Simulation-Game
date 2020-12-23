import { retire } from "../mockObjs";
import Player from "./Player";
import { getStats } from "./statGen";
import { Location } from "../models";

describe("Player", () => {
  const name = "Test Player";
  const pos = 0;
  const id = 1;

  const player = new Player(name, id, pos, retire);
  it("Is created", () => {
    expect(player).toEqual(
      expect.objectContaining({
        name,
        pos,
        id,
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
