import { Archetype, Location, NUM_STATS } from "../models";
import { Stat, Stats } from "./Stats";
import { getRand } from "../services/funcs";
import { Player, SeasonStats } from "./Player";

const makePlayer = (): Player => {
  const statValues = [20, 20, 20, 20, 20, 20, 20, 20, 20].map(
    (stat: number) => new Stat(stat, 1)
  );
  const stats = new Stats(statValues);
  const contract = {
    price: 10,
    yearsLeft: 3,
  };
  const seasonStats = [new SeasonStats([])];

  return new Player(
    "Test player",
    20,
    0,
    0,
    Archetype.SHARPSHOOTER,
    70,
    stats,
    contract,
    seasonStats
  );
};

describe("Player", () => {
  const player = makePlayer();

  it("Is created", () => {
    expect(player.name).toEqual("Test player");
  });

  it("Updates stats on advance year", () => {
    player.advanceYear();

    const notAllEqualTo40 = player.stats.all.some(
      (stat: number) => stat !== 40
    );
    console.log(player.stats.all);
    expect(notAllEqualTo40).toBeTruthy();
  });
});

describe("Stats", () => {
  it("Stays in bounds after updating", () => {
    const stat = new Stat(20, 1);

    for (let i = 0; i < 50; i++) {
      stat.update(getRand(40, 100));
      expect(stat.value).toBeLessThanOrEqual(40);
      expect(stat.value).toBeGreaterThanOrEqual(0);
    }
  });

  it("Calculates correct rating", () => {
    const statsArr = [];

    for (let i = 0; i < NUM_STATS; i++) {
      statsArr.push(new Stat(20, 1));
    }

    const stats = new Stats(statsArr);
    expect(stats.rating).toEqual(40);
  });
});
