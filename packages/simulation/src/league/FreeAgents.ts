import { Player } from "../player/Player";
import { Team } from "../team/Team";

export class FreeAgents {
  private _players: Player[];

  get START_NUM_FREE_AGENTS(): number {
    return 60;
  }

  constructor(getId: () => number, genPlayerName: () => string) {
    const retire = (player: Player) => {
      this.removePlayer(player);
    };

    this._players = [];

    for (let i = 0; i < this.START_NUM_FREE_AGENTS; i++) {
      this._players.push(new Player(genPlayerName(), getId(), -1, retire));
    }

    this.sort();
  }

  removePlayer(player: Player): void {
    const foundAt = this._players.indexOf(player);

    if (foundAt === -1) {
      throw new Error(`Given invalid player`);
    }

    this._players.splice(foundAt, 1);
  }

  addPlayers(playersToAdd: Player[]): void {
    this._players.concat(playersToAdd);
    this.sort();
  }

  sort(): void {
    this._players.sort((a: Player, b: Player) => a.playerComp(b));
  }

  advanceYear(): void {
    this._players.forEach((player: Player) => {
      player.advanceYear();
    });
    this.sort();
  }

  sim(teams: Team[]): void {
    const randomOrderTeams = teams.sort((a: Team, b: Team) => Math.random());

    randomOrderTeams.forEach((team: Team) => {
      const [playersPicked, playersNotPicked] = team.pickPlayers(this._players);
      this._players = this._players.filter(
        (player: Player) => !playersPicked.includes(player)
      );
    });
  }

  get players(): Player[] {
    return this._players;
  }
}
