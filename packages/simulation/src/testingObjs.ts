import Player from "./player/player";
import Team from "./team/Team";
import League from "./league/league";
import { TeamNames } from "./models";
import Game from "./game/Game";

const mockGenPlayerName = (): string => {
  return "John Smith";
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

export const testPlayer = new Player("Joe Smith", 0, 1);

export const testTeam1 = new Team(
  mockGetTeamNames(),
  mockGenPlayerName,
  mockGetId,
  15
);
export const testTeam2 = new Team(
  mockGetTeamNames(),
  mockGenPlayerName,
  mockGetId,
  15
);

export const testGame = new Game(testTeam1, testTeam2);

export const testLeague = new League(mockGenPlayerName, mockGetTeamNames);
