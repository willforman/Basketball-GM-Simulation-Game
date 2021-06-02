import {
  getArchetype,
  getStatsNums,
  getPrimaryIdxs,
  getLocs,
  calcRating,
  calcPotential,
  calcContract,
} from "./statGen";
import { Archetype, Contract, NUM_STATS } from "../models";
import { Player, SeasonStats } from "./Player";
import { Stat, Stats } from "./Stats";
import { getRand } from "../services/funcs";
import { BoxScore } from "../game/BoxScore";

export const buildStats = (archetype: Archetype): Stats => {
  const primaryIdxs = getPrimaryIdxs(archetype);

  const statsArr: Stat[] = [];

  for (let idx = 0; idx < NUM_STATS; idx++) {
    const statValue = getRand(0, 40);
    const primaryMult = primaryIdxs.includes(idx) ? 2 : 1;

    statsArr.push(new Stat(statValue, primaryMult));
  }

  return new Stats(statsArr);
};

export const buildPlayer = (
  young: boolean,
  name: string,
  id: number,
  givenPos: number
): Player => {
  const pos =
    0 <= givenPos && givenPos <= 4 ? givenPos : Math.floor(Math.random() * 5);

  const ageVar = young ? 3 : 15;
  const age = 19 + Math.floor(Math.random() * ageVar);

  const archetype = getArchetype(pos + Math.round(Math.random()));
  const stats = buildStats(archetype);
  const potential = calcPotential(age);
  const contract = calcContract(stats.rating, potential);
  const seasonStats: SeasonStats[] = [new SeasonStats([])];

  return new Player(
    name,
    age,
    id,
    pos,
    archetype,
    potential,
    stats,
    contract,
    seasonStats
  );
};
