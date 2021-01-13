export interface LeagueNames {
  east: DivNames[];
  west: DivNames[];
}

export interface DivNames {
  teams: TeamNames[];
  name: string;
}

export interface TeamNames {
  name: string;
  location: string;
  abbreviation: string;
}
