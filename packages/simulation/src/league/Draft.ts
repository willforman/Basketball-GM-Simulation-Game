import Player from "../player/Player";

export default class Draft {
  private players: Player[];

  get DRAFT_NUM_PLAYERS(): number {
    return 50;
  }

  constructor(genName: () => string, getId: () => number) {
    this.players = [];

    const retire = (player: Player): void => {
      this.removePlayer(player);
    };

    for (let i = 0; i < this.DRAFT_NUM_PLAYERS; i++) {
      this.players.push(new Player(genName(), getId(), -1, retire, true));
    }

    this.players.sort((a: Player, b: Player) => a.playerComp(b));
  }

  removePlayer(playerRemove: Player): void {
    const playerIdx = this.players.indexOf(playerRemove);

    if (!playerIdx) {
      throw new Error("Given player can't be found");
    }

    this.players.splice(playerIdx, 1);
  }

  getPlayers(): Player[] {
    return this.players;
  }
}
