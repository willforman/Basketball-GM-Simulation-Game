import { League } from "./League";

export enum LeagueState {
  PRESEASON_DRAFT = "preseasonDraft",
  PRESEASON_FREE_AGENCY = "preseasonFreeAgency",
  REGULAR_SEASON = "regularSeason",
  PLAYOFFS = "playoffs",
}

export interface SimAction {
  name: string;
  func: () => void;
}

export interface SimActions {
  actions: SimAction[];
  advFunc: () => void;
  isStateComplete: () => boolean;
}

export const getNextState = (state: LeagueState): LeagueState => {
  switch (state) {
    case LeagueState.PRESEASON_DRAFT:
      return LeagueState.PRESEASON_FREE_AGENCY;
    case LeagueState.PRESEASON_FREE_AGENCY:
      return LeagueState.REGULAR_SEASON;
    case LeagueState.REGULAR_SEASON:
      return LeagueState.PLAYOFFS;
    case LeagueState.PLAYOFFS:
      return LeagueState.PRESEASON_DRAFT;
  }
};

export const getActions = (league: League): SimActions => {
  switch (league.state) {
    case LeagueState.REGULAR_SEASON:
      return {
        actions: [
          { name: "1 game", func: league.regularSeason.simWeek },
          { name: "Season", func: league.regularSeason.simAll },
        ],
        advFunc: league.advToPlayoffs,
        isStateComplete: () => league.regularSeason.completed,
      };
    case LeagueState.PLAYOFFS:
      return {
        actions: [
          { name: "1 round", func: league.playoffs.simRound },
          { name: "Playoffs", func: league.playoffs.simAll },
        ],
        advFunc: league.advToDraft,
        isStateComplete: () => league.playoffs.completed,
      };
    case LeagueState.PRESEASON_DRAFT:
      return {
        actions: [{ name: "Draft", func: league.draft.sim }],
        advFunc: league.advToFreeAgency,
        isStateComplete: () => league.draft.completed,
      };
    case LeagueState.PRESEASON_FREE_AGENCY:
      return {
        actions: [{ name: "Free Agency", func: league.simFreeAgency }],
        advFunc: league.advToRegSeason,
        isStateComplete: () => true,
      };
  }
};
