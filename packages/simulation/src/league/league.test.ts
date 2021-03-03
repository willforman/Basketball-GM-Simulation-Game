import { makeLeague } from "../testingObjs/testingObjs";

const league = makeLeague();

describe("League", () => {
  it("Gets teams", () => {
    expect(league.teams.length).toBe(30);
  });
});

describe("Regular Season", () => {
  it("Simulates", () => {
    league.regularSeason.simWeek();
    league.regularSeason.simAll();

    expect(league.regularSeason.completed).toBeTruthy();
  });
});

describe("Playoffs", () => {
  it("Simulates", () => {
    league.advToPlayoffs();

    league.playoffs.simRound();
    league.playoffs.simAll();
    expect(league.winner).toBeTruthy();
  });

  it("Gets all playoff teams", () => {
    expect(league.playoffs.teamsInDraftOrder).toContain(league.playoffs.winner);
    expect(league.playoffs.teamsInDraftOrder.length).toBe(16);
  });
});

describe("Draft", () => {
  it("Simulates", () => {
    league.advToDraft();
    league.draft.sim();
  });
});

describe("Free Agency", () => {
  it("Simulates", () => {
    const freeAgentsStartNum = league.freeAgents.players.length;
    league.advToFreeAgency();
    league.freeAgents.sim(league.teams);

    expect(freeAgentsStartNum).toBeGreaterThan(
      league.freeAgents.players.length
    );
  });
});

// describe("Game Scheduling", () => {
//   const confs = makeConfs();

//   const expectSameLengths2d = <T>(weeks: T[][]): void => {
//     const lengths = new Map<number, number>();

//     weeks.forEach((curr: T[]) => {
//       lengths.set(curr.length, (lengths.get(curr.length) ?? 0) + 1);
//     });

//     if (lengths.size !== 1) {
//       console.error(lengths);
//       expect(lengths.size).toBe(1);
//     }
//   };

//   const expectCorrectNumOfGames = (games: Game[][]) => {
//     games.forEach((week: Game[]) => {
//       expect(week.length).toBe(15);
//     });
//   };

//   const expectTeamToBeInGames = (games: Game[][], confs: Team[][][]) => {
//     const teams = [confs[0][0][0], confs[1][0][0], confs[0][2][0]];

//     teams.forEach((team: Team, teamIdx: number) => {
//       games.forEach((gamesThisWeek: Game[], idx: number) => {
//         let found = false;
//         gamesThisWeek.forEach((game: Game) => {
//           if (game.isTeamInGame(team)) {
//             found = true;
//           }
//         });

//         if (!found) {
//           console.error(teamIdx);
//         }

//         expect(found).toBeTruthy();
//       });
//     });
//   };

//   const expectSchedulingToBeCorrect = (
//     getGames: (confs: Team[][][]) => Game[][],
//     weeksShouldBe: number
//   ): void => {
//     const games = getGames(confs);

//     expectSameLengths2d(games);
//     expectCorrectNumOfGames(games);
//     expectTeamToBeInGames(games, confs);

//     expect(games.length).toBe(weeksShouldBe);
//   };

//   it("Combine 2d arrays", () => {
//     let baseArr: number[][] = [];
//     const arr1 = [
//       [1, 2],
//       [3, 4],
//     ];
//     const arr2 = [
//       [5, 6],
//       [7, 8],
//     ];

//     baseArr = combine2DArrs(baseArr, arr1);

//     baseArr = combine2DArrs(baseArr, arr2);

//     expect(baseArr[0]).toHaveLength(4);
//   });

//   it("Creates in division games", () => {
//     expectSchedulingToBeCorrect(getDivGames, 4);
//   });

//   it("Creates out of division games", () => {
//     expectSchedulingToBeCorrect(getNonDivGames, 10);
//   });

//   it("Creates out of conference games", () => {
//     expectSchedulingToBeCorrect(getNonConfGames, 15);
//   });

//   it("Creates full schedule", () => {
//     const games = getSeasonGames(confs);

//     expect(games.length).toBe(82);
//   });
// });
