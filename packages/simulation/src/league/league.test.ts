import { league } from "../testingObjs";

describe("League", () => {
  it("Find team by location", async () => {
    // test league has all teams with location of "test location"
    const team = league.getTeamByLocation("Test Location");

    expect(team).toBeTruthy();
  });
});
