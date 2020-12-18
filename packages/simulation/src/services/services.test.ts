import teamNames from "../models/TeamNames";
import PlayerNameGenService from "./PlayerNameService";
import RandomSelector from "./RandomSelector";
import TeamNameGenService from "./TeamNameService";

it("Generates team names", async () => {
  const service = await TeamNameGenService.build();

  const atlNames: teamNames = {
    name: "Hawks",
    location: "Atlanta",
    abbreviation: "ATL",
  };

  const bosNames: teamNames = {
    name: "Celtics",
    location: "Boston",
    abbreviation: "BOS",
  };

  expect(service.getNextName()).toEqual(expect.objectContaining(atlNames));

  expect(service.getNextName()).toEqual(expect.objectContaining(bosNames));
});

it("Generates player name", async () => {
  const ng = await PlayerNameGenService.build();

  const name = ng.getName();

  expect(name).toBeTruthy();
});

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
