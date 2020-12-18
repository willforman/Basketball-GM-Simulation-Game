import Player from "./player";

it("player is created", () => {
  const player = new Player("Joe Smith", 0, 1);

  expect(player).toEqual(
    expect.objectContaining({
      name: "Joe Smith",
      pos: 0,
    })
  );
});
