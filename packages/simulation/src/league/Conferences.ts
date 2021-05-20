import { Team } from "../team/Team";
import { Player } from "../player/Player";
import { TeamNames, LeagueNames, DivNames } from "../models";

export class Conferences {
  private _conferences: Conference[];

  constructor(
    confNames: LeagueNames,
    genPlayer: (pos: number, retire: (player: Player) => void) => Player
  ) {
    let currTeamId = 0;

    const getTeamId = () => currTeamId++;

    this._conferences = [];
    this._conferences.push(
      new Conference(confNames.east, genPlayer, getTeamId)
    );
    this._conferences.push(
      new Conference(confNames.west, genPlayer, getTeamId)
    );
  }

  sort(): void {
    this._conferences.forEach((conf: Conference) => conf.sort());
  }

  advanceYear(): void {
    this.eastTeams.forEach((team: Team) => team.advanceYear());
    this.westTeams.forEach((team: Team) => team.advanceYear());
  }

  get eastTeams(): Team[] {
    return this._conferences[0].teams;
  }

  get westTeams(): Team[] {
    return this._conferences[1].teams;
  }

  get teamsByDiv(): Team[][][] {
    const leagueTeams: Team[][][] = [];
    this._conferences.forEach((conf: Conference) => {
      const confTeams: Team[][] = [];
      conf.divisions.forEach((div: Division) => {
        confTeams.push(div.teams);
      });
      leagueTeams.push(confTeams);
    });

    return leagueTeams;
  }

  get allTeams(): Team[] {
    return this.eastTeams.concat(this.westTeams);
  }

  get playoffTeams(): Team[][] {
    return [
      this._conferences[0].playoffTeams,
      this._conferences[0].playoffTeams,
    ];
  }

  get nonPlayoffTeams(): Team[][] {
    return [
      this._conferences[0].nonPlayoffTeams,
      this._conferences[0].nonPlayoffTeams,
    ];
  }

  sortTeams(teams: Team[]): Team[] {
    return teams.sort((a: Team, b: Team) => b.winPct - a.winPct);
  }

  get standings(): [Team[], Team[]] {
    return [this.sortTeams(this.eastTeams), this.sortTeams(this.westTeams)];
  }
}

class Conference {
  private _divisions: Division[];
  private _teams: Team[];

  constructor(
    divsNames: DivNames[],
    genPlayer: (pos: number, retire: (player: Player) => void) => Player,
    getTeamId: () => number
  ) {
    this._teams = [];
    this._divisions = [];

    divsNames.forEach((div: DivNames) => {
      const divTeams = div.teams.reduce(
        (arr: Team[], curr: TeamNames) =>
          arr.concat(new Team(curr, genPlayer, getTeamId())),
        []
      );
      this._teams = this._teams.concat(divTeams);
      this._divisions.push(new Division(divTeams));
    });
  }

  sort(): void {
    this._teams.sort((a: Team, b: Team) => a.wins - b.wins);
  }

  get divisions(): Division[] {
    return this._divisions;
  }

  get teams(): Team[] {
    return this._teams;
  }

  get playoffTeams(): Team[] {
    this._teams.sort((a: Team, b: Team) => a.wins - b.wins);

    return this._teams.slice(0, 8);
  }

  get nonPlayoffTeams(): Team[] {
    this._teams.sort((a: Team, b: Team) => a.wins - b.wins);

    return this._teams.slice(-8);
  }
}

class Division {
  private _teams: Team[];

  constructor(teams: Team[]) {
    this._teams = teams;
  }

  sort(): void {
    this._teams.sort((a: Team, b: Team) => a.wins - b.wins);
  }

  get teams(): Team[] {
    return this._teams;
  }
}
