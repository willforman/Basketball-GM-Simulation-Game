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
