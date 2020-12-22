import Player from "./player/Player";
import Team from "./team/Team";
import Game from "./game/Game";
import League from "./league/League";
import { TeamNames } from "./models";

const mockGenPlayerName = (): string => {
  return "Joe Smith";
};

const mockGetTeamNames = (): TeamNames => {
  return {
    name: "Test Team",
    location: "Test Location",
    abbreviation: "TEST",
  };
};

let id = 0;
const mockGetId = () => {
  return id++;
};

export const player = new Player("Joe Smith", 1, 0);

export const team1 = new Team(
  mockGetTeamNames(),
  mockGenPlayerName,
  mockGetId,
  15
);
export const team2 = new Team(
  mockGetTeamNames(),
  mockGenPlayerName,
  mockGetId,
  15
);
export const team3 = new Team(
  mockGetTeamNames(),
  mockGenPlayerName,
  mockGetId,
  15
);
export const team4 = new Team(
  mockGetTeamNames(),
  mockGenPlayerName,
  mockGetId,
  15
);

export const game = new Game(team1, team2, 0);

export const league = new League(mockGenPlayerName, mockGetTeamNames);
