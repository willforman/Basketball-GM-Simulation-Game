import Player from "../player/Player";

export default class FreeAgents {
  private players: Player[];

  get START_NUM_FREE_AGENTS(): number {
    return 60;
  }

  constructor(getId: () => number, genPlayerName: () => string) {
    const retire = (player: Player) => {
      this.removePlayer(player);
    };

    this.players = [];

    for (let i = 0; i < this.START_NUM_FREE_AGENTS; i++) {
      this.players.push(new Player(genPlayerName(), getId(), -1, retire));
    }
  }

  removePlayer(player: Player): void {
    const foundAt = this.players.indexOf(player);

    if (foundAt === -1) {
      console.log(`Invalid player given`);
    }

    this.players.splice(foundAt, 1);
  }

  addPlayers(playersToAdd: Player[]): void {
    this.players.concat(playersToAdd);
    this.players.sort((a: Player, b: Player) => a.playerComp(b));
  }
}
