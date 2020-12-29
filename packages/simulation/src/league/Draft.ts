import Player from "../player/Player";
import Team from "../team/Team";

export default class Draft {
  private players: Player[];
  private order: Team[];

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

  removePlayer(playerRemove: Player): void {
    const playerIdx = this.players.indexOf(playerRemove);

    if (playerIdx === -1) {
      throw new Error("Given player can't be found");
    }

    this.players.splice(playerIdx, 1);
  }

  getPlayers(): Player[] {
    return this.players;
  }
}
