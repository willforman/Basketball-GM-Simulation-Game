import { testLeague } from "../testingObjs";

it("league is created", async () => {
  // test league has all teams with location of "test location"
  const team = testLeague.getTeamByLocation("Test Location");

  expect(team).toBeTruthy();
});
