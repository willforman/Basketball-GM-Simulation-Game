import { TeamNames } from "./models";

export const genPlayerName = (): string => {
  return "Test Player";
};

export const getTeamNames = (): TeamNames => {
  return {
    name: "Test Team",
    location: "Test Location",
    abbreviation: "TEST",
  };
};

let id = 0;
export const getId = () => {
  return id++;
};

export const retire = () => {
  1 + 1;
};
