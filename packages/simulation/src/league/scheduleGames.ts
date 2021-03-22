import { Team } from "../team/Team";
import { Game } from "../game/Game";

export const roundRobin = (teamsPassed: Team[]): Game[][] => {
  const games: Game[][] = [];

  // copy the teams given but remove the first team, and save it
  const copyTeams = teamsPassed.filter((team: Team, idx: number) => idx !== 0);
  const removedTeam = teamsPassed[0];

  // will require number of teams - 1 to complete round robin
  for (let week = 0; week < teamsPassed.length - 1; week++) {
    const gamesThisWeek: Game[] = [];
    games.push(gamesThisWeek);

    const teamIdx = week % copyTeams.length;

    const g1 = new Game(copyTeams[teamIdx], removedTeam, teamIdx);
    gamesThisWeek.push(g1);

    removedTeam.addGame(g1);
    copyTeams[teamIdx].addGame(g1);

    for (let i = 1; i < (copyTeams.length + 1) / 2; i++) {
      const firstIdx = (week + 1) % copyTeams.length;
      const secondIdx = (week + copyTeams.length - 1) % copyTeams.length;

      const g2 = new Game(copyTeams[firstIdx], copyTeams[secondIdx], teamIdx);
      gamesThisWeek.push(g2);

      copyTeams[firstIdx].addGame(g2);
      copyTeams[secondIdx].addGame(g2);
    }
  }

  return games;
};

export const combine2DArrs = <T>(arr1: T[][], arr2: T[][]): T[][] => {
  if (arr1 === undefined || arr1.length === 0) {
    return arr2;
  }
  if (arr2 === undefined || arr2.length === 0) {
    return arr1;
  }

  if (arr1.length !== arr2.length) {
    throw new Error(
      `Can't combine with diff lengths: ${arr1.length}, ${arr2.length}`
    );
  } else {
    const combined: T[][] = [];
    for (let i = 0; i < arr1.length; i++) {
      combined.push(arr1[i].concat(arr2[i]));
    }

    return combined;
  }
};

const makeMultiple = (
  getGames: (teams: Team[][][]) => Game[][],
  teams: Team[][][],
  num: number
): Game[][] => {
  let multiple: Game[][] = [];

  for (let i = 0; i < num; i++) {
    multiple = multiple.concat(getGames(teams));
  }

  return multiple;
};

// plays each team in division 4 times
export const getDivGames = (confs: Team[][][]): Game[][] => {
  let games: Game[][] = [];

  confs.forEach((conf: Team[][]) => {
    conf.forEach((div: Team[]) => {
      games = combine2DArrs(games, roundRobin(div));
    });
  });

  return games;
};

// plays 6 out of div teams 4 times
// and 4 out of div teams 3 times
export const getNonDivGames = (confs: Team[][][]): Game[][] => {
  let games: Game[][] = [];

  confs.forEach((conf: Team[][]) => {
    conf.forEach((div: Team[], divIdx: number) => {
      if (divIdx === div.length - 1) {
        return;
      }
      const otherDivs = conf.filter(
        (divFilter: Team[], fIdx: number) => divIdx !== fIdx
      );
      const otherDivsTeams = otherDivs[0].concat(otherDivs[1]);

      div.forEach((team: Team) => {
        games = combine2DArrs(games, roundRobin(otherDivsTeams.concat(team)));
      });
    });
  });

  return games;
};

// plays each out of conference team 2 times
export const getNonConfGames = (teams: Team[][][]): Game[][] => {
  let games: Game[][] = [];

  const conf1 = teams[0];
  const conf2Teams = teams[1].reduce(
    (acc: Team[], curr: Team[]) => acc.concat(curr),
    []
  );

  conf1.forEach((div: Team[]) => {
    div.forEach((team: Team) => {
      games = combine2DArrs(games, roundRobin(conf2Teams.concat(team)));
    });
  });

  return games;
};

export const getSeasonGames = (confs: Team[][][]): Game[][] => {
  const divGames = makeMultiple(getDivGames, confs, 4);
  const nonConfGames = makeMultiple(getNonConfGames, confs, 2);

  const nonDivGames = makeMultiple(getNonDivGames, confs, 4);
  while (nonDivGames.length !== 36) {
    const randIdx = Math.floor(Math.random() * nonDivGames.length);
    nonDivGames.splice(randIdx, 1);
  }

  const allGames = divGames.concat(nonConfGames, nonDivGames);

  return allGames.sort(() => Math.random() - 0.5);
};
