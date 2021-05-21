import { League } from "./League";

export enum LeagueState {
  PRESEASON_DRAFT = "preseasonDraft",
  PRESEASON_FREE_AGENCY = "preseasonFreeAgency",
  REGULAR_SEASON = "regularSeason",
  PLAYOFFS = "playoffs",
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

export const getActionNames = (state: LeagueState): string[] => {
  switch (state) {
    case LeagueState.REGULAR_SEASON:
      return ["1 game", "Season"];
    case LeagueState.PLAYOFFS:
      return ["1 round", "Playoff"];
    case LeagueState.PRESEASON_DRAFT:
      return ["Draft"];
    case LeagueState.PRESEASON_FREE_AGENCY:
      return ["Free Agency"];
  }
};

export const simForState = (league: League, actionName: string): void => {
  switch (league.state) {
    case LeagueState.REGULAR_SEASON:
      if (actionName === "1 game") {
        league.regularSeason.simWeek();
        if (league.regularSeason.completed) {
          league.advToPlayoffs();
        }
      } else {
        league.regularSeason.simAll();
        league.advToPlayoffs();
      }
      break;
    case LeagueState.PLAYOFFS:
      if (actionName === "1 round") {
        league.playoffs.simRound();
        if (league.playoffs.completed) {
          league.advToDraft();
        }
      } else {
        league.playoffs.simAll();
        league.advToDraft();
      }
      break;
    case LeagueState.PRESEASON_DRAFT:
      league.draft.sim();
      league.advToFreeAgency();
      break;
    case LeagueState.PRESEASON_FREE_AGENCY:
      league.freeAgents.sim(league.teams);
      league.advToRegSeason();
      break;
  }
};
