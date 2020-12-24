import Player from "../player/Player";

export default class Draft {
  private players: Player[];

  private genName: () => string;
  private getId: () => number;
  private retire: (player: Player) => void;

  get DRAFT_NUM_PLAYERS(): number {
    return 50;
  }

  constructor(genName: () => string, getId: () => number) {
    this.genName = genName;
    this.getId = getId;

    this.players = [];

    this.retire = (player: Player): void => {
      this.removePlayer(player);
    };
  }

  getNewPlayers(): void {
    if (this.players.length !== 0) {
      throw new Error("Previous draft players haven't been handled");
    }

    for (let i = 0; i < this.DRAFT_NUM_PLAYERS; i++) {
      this.players.push(
        new Player(this.genName(), this.getId(), -1, this.retire, true)
      );
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

  clearPlayers(): void {
    this.players = [];
  }
}
