import { TeamNames } from "../models";
import PlayerNameGenService from "./PlayerNameService";
import RandomSelector from "./RandomSelector";
import getTeamNames from "./getTeamNames";

describe("Team Name Service", () => {
  it("Generates team names", async () => {
    const teamNames = await getTeamNames();

    const atlNames: TeamNames = {
      name: "Hawks",
      location: "Atlanta",
      abbreviation: "ATL",
    };

    const bosNames: TeamNames = {
      name: "Celtics",
      location: "Boston",
      abbreviation: "BOS",
    };

    expect(teamNames[0]).toEqual(expect.objectContaining(atlNames));

    expect(teamNames[1]).toEqual(expect.objectContaining(bosNames));
  });
});

describe("Player Name Service", () => {
  it("Generates player name", async () => {
    const ng = await PlayerNameGenService.build();

    const name = ng.getName();

    expect(name).toBeTruthy();
  });
});

describe("Random Selector", () => {
  it("Random selection", () => {
    const choices = [
      { item: "one", weight: 10 },
      { item: "two", weight: 20 },
    ];

    const rs = new RandomSelector(choices);

    let oneSelected = 0;
    for (let i = 0; i < 1000; i++) {
      const choice = rs.getChoice();

      if (choice == "one") {
        oneSelected++;
      }
    }

    // checks if the value is selected between 30-37% of the selections
    // ideally should be 33%
    expect(oneSelected).toBeGreaterThanOrEqual(300);
    expect(oneSelected).toBeLessThanOrEqual(370);
  });
});
