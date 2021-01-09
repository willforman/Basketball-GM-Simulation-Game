import Game from "./game/Game";
import League from "./league/League";
import { TeamNames } from "./models";
import Player from "./player/Player";
import Team from "./team/Team";

const genPlayerName = (): string => {
  return "Test Player";
};

let teamNum = 0;
const getTeamNames = (): TeamNames => {
  return {
    name: `Team ${teamNum}`,
    location: "Test Location",
    abbreviation: `T${teamNum++}`,
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
  const teamNames = teamNamesGiven ?? getTeamNames();
  return new Team(teamNames, genPlayerName, getId);
};

export const makeGame = (team1: Team, team2: Team): Game => {
  return new Game(team1, team2, 0);
};

export const makePlayer = (nameGiven?: string): Player => {
  const name = nameGiven ?? "Test Player";
  return new Player(name, 0, 0, retire);
};

export const makeLeague = (): League => {
  return new League(genPlayerName, getTeamNames);
};
