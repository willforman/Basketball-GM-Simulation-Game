import teamNames from "../models/TeamNames";
import NameGen from "./NameGen";
import RandomSelector from "./RandomSelector";
import TeamNamesService from "./TeamNamesService";

it("Gets team names", async () => {
  const service = await TeamNamesService.build();

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

it("generates names correctly", async () => {
  const ng = await NameGen.build();

  const name = ng.getName();

  expect(name).toBeTruthy();
});

it("Random number selection with weights", () => {
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
