import { Player } from "../player/Player";
import { Team } from "../team/Team";
import { Pick, LEAGUE_SIZE } from "../models";

export class Draft {
  private _players: Player[];
  private _order: Team[];

  private _picks: Pick[];
  private _pickNum: number;
  private _completed: boolean;

  get DRAFT_NUM_PLAYERS(): number {
    return 64 + 30;
  }

  constructor(
    genPlayer: (pos: number, retire: (player: Player) => void) => Player,
    nonPlayoffTeams: Team[]
  ) {
    this._players = [];
    this._picks = [];

    const retire = (player: Player): void => {
      this.removePlayer(player);
    };

    for (let i = 0; i < this.DRAFT_NUM_PLAYERS; i++) {
      this._players.push(genPlayer(-1, retire));
    }

    this._players.sort((a: Player, b: Player) => a.playerComp(b));

    this._order = nonPlayoffTeams;
  }

  addPlayoffTeams(playoffTeams: Team[]): void {
    this._order = this._order.concat(playoffTeams);
  }

  setPicksInOrder(): void {
    if (this._order.length !== LEAGUE_SIZE) {
      throw new Error(`Not all teams have been added: ${this._order.length}`);
    }

    for (let i = 0; i < LEAGUE_SIZE * 2; i++) {
      this._picks.push();
    }

    for (let i = 0; i < LEAGUE_SIZE; i++) {
      const team = this._order[i];
      const [firstPick, secondPick] = team.getPicks();

      this._picks[i] = firstPick;
      this._picks[i + LEAGUE_SIZE] = secondPick;
    }

    this._pickNum = 0;
  }

  sim(): void {
    if (this._picks.length !== LEAGUE_SIZE * 2) {
      throw new Error(`Picks haven't been set yet`);
    }
    if (this._completed) {
      throw new Error(`Draft is already completed`);
    }

    this._picks.forEach((pick: Pick) => {
      const top15 = this._players.slice(0, 15);
      const playerPicked = pick.teamOwning.pickPlayer(top15);

      this.pickPlayer(playerPicked, pick);
    });
  }

  pickPlayer(player: Player, pick: Pick): void {
    pick.playerPicked = player;

    pick.teamOwning.addPlayer(player);

    this.removePlayer(player);

    this._pickNum++;
    if (this._pickNum === LEAGUE_SIZE * 2) {
      this._completed = true;
    }
  }

  removePlayer(playerRemove: Player): void {
    const playerIdx = this._players.indexOf(playerRemove);

    if (playerIdx === -1) {
      throw new Error("Given player can't be found");
    }

    this._players.splice(playerIdx, 1);
  }

  get picks(): Pick[] {
    return this._picks;
  }

  get players(): Player[] {
    return this._players;
  }

  get completed(): boolean {
    return this._completed;
  }
}
