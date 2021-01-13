import {
  makeConfs,
  makeGame,
  makeLeague,
  makeLeagueNames,
  makePlayer,
  makeTeam,
} from "./testingObjs";

describe("Testing Objects", () => {
  it("Makes player", () => {
    const player = makePlayer();

    expect(player.id).toBe(0);
  });

  it("Makes team", () => {
    const team = makeTeam();

    expect(team.roster.allPlayers).toHaveLength(15);
  });

  it("Makes game", () => {
    const t1 = makeTeam();
    const t2 = makeTeam();
    const game = makeGame(t1, t2);

    expect(game.teams[0].abreviation).toBe(t1.abreviation);
    expect(game.teams[1].abreviation).toBe(t2.abreviation);
  });

  it("Makes conferences", () => {
    const confs = makeConfs();

    expect(confs).toHaveLength(2);
    expect(confs[0]).toHaveLength(3);
    expect(confs[0][0]).toHaveLength(5);
  });

  it("Makes conference names", () => {
    const confs = makeLeagueNames();

    expect(confs.east).toHaveLength(3);
    expect(confs.east[0].name).toHaveLength(5);
  });
});
