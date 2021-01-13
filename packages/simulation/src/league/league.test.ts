import {
  trans3Dto2D,
  getDivGames,
  getNonConfGames,
  getNonDivGames,
  getSeasonGames,
} from "./scheduleGames";
import { makeLeague, makeConfs } from "../testingObjs/testingObjs";

describe("League", () => {
  const league = makeLeague();

  it("Find team by location", () => {
    // test league has all teams with location of "test location"
    const team = league.getTeamByLocation("Test Location");

    expect(team).toBeTruthy();
  });

  it("Simulates season", () => {
    league.regularSeason.simWeek();
    league.regularSeason.simAll();

    expect(league.regularSeason.completed).toBeTruthy();
  });

  it("Simulates playoffs", () => {
    league.advToPlayoffs();

    league.playoffs.simRound();
    league.playoffs.simAll();
    expect(league.winner).toBeTruthy();
  });

  it("Simulates draft", () => {
    league.advToDraft();

    league.draft.sim();
  });

  it("Simulates free agency", () => {
    league.advToFreeAgency();

    league.freeAgents.sim();
  });
});

// describe("Game Scheduling", () => {
//   const team1 = makeTeam();
//   const team2 = makeTeam();
//   const team3 = makeTeam();
//   const team4 = makeTeam();

//   const teams = [team1, team2, team3, team4];
//   it("Generates regular season", () => {
//     const games = genRegularSeasonGames(teams);

//     let count = 0;
//     games.forEach((week: Game[]) => {
//       week.forEach((game: Game) => {
//         expect(game).toBeTruthy();
//         count++;
//       });
//     });

//     expect(count).toBe(6);
//   });

//   it("Generates playoffs rounds", () => {
//     const round = genPlayoffsNextRound(teams);

//     expect(round).toBeTruthy();
//   });
// });

describe("Game Scheduling", () => {
  const confs = makeConfs();
  it("Transforms 3d array to 2d", () => {
    const pairs = [
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ];

    const arr3D = [
      [pairs[0], pairs[1]],
      [pairs[2], pairs[3]],
    ];

    const arr2D = trans3Dto2D(arr3D);

    expect(arr2D).toStrictEqual(pairs);
  });

  it("Gets in division games", () => {
    const games = getDivGames(confs);

    expect(games).toHaveLength(5);
  });

  // it("Creates out of division games", () => {
  //   const games = getNonDivGames(confs);

  //   expect(games).toHaveLength(24);
  // });

  // it("Creates out of conference games", () => {
  //   const games = getNonConfGames(confs);

  //   expect(games).toHaveLength(15);
  // });

  // it("Creates full schedule", () => {
  //   const games = getSeasonGames(confs);

  //   expect(games).toHaveLength(82);
  // });
});
