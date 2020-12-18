import { testLeague } from "../testingObjs";

it("league is created", async () => {
  const chiTeam = testLeague.getTeamByLocation("Chicago");

  expect(chiTeam).toBeTruthy();
});
