import Team from "./Team";

import { testTeam1, testTeam2 } from "../testingObjs";

it("Get player array", async () => {
  const players = testTeam1.getPlayerArray();

  expect(players.length).toBe(testTeam1.getNumberOfPlayers());
});
