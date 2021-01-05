import Player from "../player/Player";
import Team from "../team/Team";
import { Pick, LEAGUE_SIZE } from "../models";

export default class Draft {
  private players: Player[];
  private order: Team[];

  private picks: Pick[];
  private pickNum: number;
  private completed: boolean;

  get DRAFT_NUM_PLAYERS(): number {
    return 94;
  }

  constructor(
    genName: () => string,
    getId: () => number,
    nonPlayoffTeams: Team[]
  ) {
    this.players = [];

    const retire = (player: Player): void => {
      this.removePlayer(player);
    };

    for (let i = 0; i < this.DRAFT_NUM_PLAYERS; i++) {
      this.players.push(new Player(genName(), getId(), -1, retire, true));
    }

    this.players.sort((a: Player, b: Player) => a.playerComp(b));

    this.order = nonPlayoffTeams;
  }

  addPlayoffTeams(playoffTeams: Team[]): void {
    this.order.concat(playoffTeams);
  }

  pickPlayer(player: Player): void {
    if (this.picks.length !== LEAGUE_SIZE * 2) {
      throw new Error(`Picks haven't been set yet`);
    }
    if (this.completed) {
      throw new Error(`Draft is already completed`);
    }

    const pick = this.picks[this.pickNum];
    pick.playerPicked = player;

    this.removePlayer(player);

    this.pickNum++;
    if (this.pickNum > LEAGUE_SIZE * 2) {
      this.completed = true;
    }
  }

  removePlayer(playerRemove: Player): void {
    const playerIdx = this.players.indexOf(playerRemove);

    if (playerIdx === -1) {
      throw new Error("Given player can't be found");
    }

    this.players.splice(playerIdx, 1);
  }

  setPicksInOrder(): void {
    if (this.order.length !== LEAGUE_SIZE) {
      throw new Error(`Not all teams have been added`);
    }

    for (let i = 0; i < LEAGUE_SIZE * 2; i++) {
      this.picks.push();
    }

    for (let i = 0; i < LEAGUE_SIZE; i++) {
      const team = this.order[i];
      const [firstPick, secondPick] = team.getPicks();

      this.picks[i] = firstPick;
      this.picks[i + LEAGUE_SIZE] = secondPick;
    }

    this.pickNum = 0;
  }

  getPicks(): Pick[] {
    return this.picks;
  }

  getPlayers(): Player[] {
    return this.players;
  }
}
