import { Game } from "../game/Game";
import { League } from "../league/League";
import { TeamNames, LeagueNames, DivNames } from "../models";
import { Player } from "../player/Player";
import { Team } from "../team/Team";

const genPlayerName = (): string => {
  return "Test Player";
};

let teamNum = 0;
const genTeamName = (): TeamNames => ({
  name: `Team ${teamNum}`,
  location: "Test Location",
  abbreviation: `T${teamNum++}`,
});

const makeMultiple = <T>(makeT: () => T, num: number): T[] => {
  const arr: T[] = [];

  for (let i = 0; i < num; i++) {
    arr.push(makeT());
  }

  return arr;
};

const makeDiv = (): Team[] => {
  return makeMultiple(makeTeam, 5);
};

const makeConf = (): Team[][] => {
  return makeMultiple(makeDiv, 3);
};

const makeDivNames = (): DivNames => {
  return {
    teams: makeMultiple(genTeamName, 5),
    name: "Test div",
  };
};

let id = 0;
const getId = (): number => {
  return id++;
};

const retire = (): void => {
  1 + 1;
};

export const makeTeam = (teamNamesGiven?: TeamNames): Team => {
  const teamNames = teamNamesGiven ?? genTeamName();
  return new Team(teamNames, genPlayerName, getId, getId());
};

export const makeGame = (team1: Team, team2: Team): Game => {
  return new Game(team1, team2, 0);
};

export const makePlayer = (nameGiven?: string): Player => {
  const name = nameGiven ?? "Test Player";
  return new Player(name, 0, 0, retire);
};

export const makeLeague = (): League => {
  return new League(genPlayerName, makeLeagueNames());
};

export const makeConfs = (): Team[][][] => {
  return [makeConf(), makeConf()];
};

export const makeLeagueNames = (): LeagueNames => {
  return {
    east: makeMultiple(makeDivNames, 3),
    west: makeMultiple(makeDivNames, 3),
  };
};
