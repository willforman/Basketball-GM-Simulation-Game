import Team from "../team/Team";
import Player from "../player/Player";
import DraftPicks from "./DraftPicks";
import { makePlayer, makeTeam } from "../testingObjs";

describe("Team", () => {
  const team = makeTeam();
  it("Gets player by postion", () => {
    const pos = 0;
    const player = team.roster.get(pos);

    expect(player).toEqual(
      expect.objectContaining({
        pos,
      })
    );
  });
});

describe("Roster", () => {
  const team = makeTeam();
  const player = makePlayer();

  const idArr = (team: Team) =>
    team.roster.allPlayers.map((player: Player) => player.id);

  it("Has unique players", () => {
    const players = team.roster.allPlayers;
    const isArrUniq = new Set(players).size === players.length;

    expect(isArrUniq).toBeTruthy();
  });

  it("Adds player", () => {
    team.addPlayer(player);

    expect(idArr(team)).toContain(player.id);
  });

  it("Removes player", () => {
    team.removePlayer(player);

    expect(idArr(team)).not.toContain(player.id);
  });

  it("Subs lineup", () => {
    const roster = team.roster;

    const subs = roster.getSubs();

    const newPos = subs.map((player: Player) => player.pos);

    for (let i = 0; i < 5; i++) {
      expect(newPos[i]).toBe(i); // needs to be correct position
    }
  });
});

describe("Draft Picks", () => {
  const team1 = makeTeam({
    name: "Team 1",
    location: "Loc 1",
    abbreviation: "T1",
  });

  const team2 = makeTeam({
    name: "Team 2",
    location: "Loc 2",
    abbreviation: "T2",
  });

  const draftPicks = new DraftPicks(team1);
  it("Gets years picks", () => {
    const picks = draftPicks.getAndRemoveCurrYearPicks();

    expect(picks[0]).toBeTruthy();
  });

  it("Advances year", () => {
    draftPicks.advanceYear();

    expect(draftPicks.picks.length).toBe(draftPicks.GEN_PICKS_YEARS_AHEAD * 2);
  });

  it("Changes ownership", () => {
    const yearsAhead = 0;
    const round = 1;

    draftPicks.changeOwnership(yearsAhead, round, team2);

    expect(draftPicks.getPick(yearsAhead, round).teamOwning.abreviation).toBe(
      team2.abreviation
    );
  });
});
