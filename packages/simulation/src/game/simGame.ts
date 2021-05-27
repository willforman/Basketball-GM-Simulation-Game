import { Move, Location, GameResult } from "../models";
import { RandomSelector } from "../services/RandomSelector";
import { Player } from "../player/Player";
import { BoxScore } from "./BoxScore";
import { CourtLocations } from "./CourtLocations";
import { Team } from "../team/Team";

const getReboundLocation: () => Location = new RandomSelector<Location>([
  { item: Location.PAINT, weight: 70 },
  { item: Location.MID_RANGE, weight: 20 },
  { item: Location.TOP_KEY, weight: 5 },
  { item: Location.CORNER, weight: 5 },
]).getChoice;

const checkShot = (shotType: Move, rating: number): number => {
  switch (shotType) {
    case Move.INSIDE_SHOT:
      return rating > Math.floor(Math.random() * 35) ? 2 : 0;
    case Move.MID_SHOT:
      return rating > Math.floor(Math.random() * 45) ? 2 : 0;
    case Move.THREE_PT_SHOT:
      return rating > Math.floor(Math.random() * 50) ? 3 : 0;
  }
  throw new Error(`Invalid shot type given: ${shotType}`);
};

const getRand = (ub: number): number => {
  return Math.floor(Math.random() * ub + 1);
};

// returns true if first rating is larger or equal, false if not
const compareRatings = (rating1: number, rating2: number): boolean => {
  const rand1 = getRand(rating1);
  const rand2 = getRand(rating2);

  return rand1 > rand2;
};

interface Possession {
  resultingPoints: number;
  secondsTaken: number;
}

interface TeamItems {
  starters: Player[];
  boxScores: Map<Player, BoxScore>;
  locations: CourtLocations;
}

const playPossession = (
  offItems: TeamItems,
  defItems: TeamItems,
  offPlayer = offItems.starters[0], // PG will start with ball at start of each possession
  offPlayerLoc = Location.TOP_KEY, // PG starts at the top of the key every time
  secondsTaken = 0,
  passBonus = 0,
  addAssistToPasser?: () => void
): Possession => {
  let resultingPoints = 0;

  secondsTaken += Math.floor(Math.random() * 14) + 6;

  // get offense variables needed
  const offBoxScore = offItems.boxScores.get(offPlayer);

  if (!offBoxScore) {
    throw new Error(`Couldn't find box score of player: ${offPlayer}`);
  }

  offItems.locations.getNewLocs(offPlayer, offPlayerLoc);

  const offMove = offPlayer.getMove(offPlayerLoc);
  const offRating = offPlayer.stats.getOffenseRating(offMove) + passBonus;

  // get defense variables needed
  defItems.locations.getNewLocs();

  const defPlayer =
    offMove === Move.PASS // if move is a pass
      ? defItems.locations.getRandPlayerAtLocation(offPlayerLoc) // player at location of offense
      : defItems.locations.getDefenderFromOffMove(offMove, offPlayerLoc); // player at location of where will shoot

  const defRating = defPlayer ? defPlayer.stats.getDefenseRating(offMove) : -1;

  // offense play wins out
  if (compareRatings(offRating, defRating)) {
    // if ball was passed
    if (offMove === Move.PASS) {
      // picks random position to pass to
      let posPassingto: number;
      do {
        posPassingto = Math.floor(Math.random() * 5);
      } while (posPassingto === offPlayer.pos); // loops until finds different position from current

      const playerPassingTo = offItems.starters[posPassingto];
      const locPassingTo = offItems.locations.getLocOfPlayer(playerPassingTo);

      const addAssistToPasser = () => {
        offBoxScore.addAssists(1);
      };

      // calls new play to be played because ball was passed
      const passResult = playPossession(
        offItems,
        defItems,
        playerPassingTo,
        locPassingTo,
        secondsTaken,
        offRating,
        addAssistToPasser
      );

      // updates current results of this play based on pass
      secondsTaken = passResult.secondsTaken;
      resultingPoints = passResult.resultingPoints;
    }
    // if ball was shot
    else {
      const shotResultPoints = checkShot(offMove, offRating);
      offBoxScore.addShot(offMove, shotResultPoints);
      resultingPoints = shotResultPoints;

      // if player was passed to, add assist to passer
      if (addAssistToPasser) {
        addAssistToPasser();
      }
    }
  }
  // if defense rating was higher
  else {
    const defBoxScore = defItems.boxScores.get(defPlayer!);

    if (!defBoxScore) {
      throw new Error(
        `Couldn't find box score of player id: ${defPlayer!.id} `
      );
    }
    // if offense tried to pass but defense stole it
    if (offMove === Move.PASS) {
      defBoxScore.addSteals(1);
    }
    //
    else {
      offBoxScore.addShot(offMove);
      // if defense rating is 20 or more higher, then it's a block and there's no chance for rebounding for offense
      if (defRating - 20 >= offRating) {
        defBoxScore.addBlocks(1);
      } else {
        const rebLoc = getReboundLocation();

        let offRebounder = offItems.locations.getRandPlayerAtLocation(rebLoc);
        let defRebounder = defItems.locations.getRandPlayerAtLocation(rebLoc);

        // if theres not a player from either team at that location,
        // use both teams centers
        if (!offRebounder && !defRebounder) {
          offRebounder = offItems.starters[4];
          defRebounder = defItems.starters[4];
        }

        const offRebRating = offRebounder ? offRebounder.stats.rebounding : -1;
        const defRebRating = defRebounder ? defRebounder.stats.rebounding : -1;

        // if offense gets rebound
        if (compareRatings(offRebRating, defRebRating)) {
          const rebounderBoxScore = offItems.boxScores.get(offRebounder!);
          rebounderBoxScore!.addRebounds(1);

          // calls new play to be played because ball was rebounded
          const passResult = playPossession(
            offItems,
            defItems,
            offRebounder!,
            offItems.locations.getLocOfPlayer(offRebounder!),
            secondsTaken,
            0
          );

          // updates current results of this play based on pass
          secondsTaken = passResult.secondsTaken;
          resultingPoints = passResult.resultingPoints;
        }
        // if defense gets rebound
        else {
          const rebounderBoxScore = defItems.boxScores.get(defRebounder!);
          rebounderBoxScore!.addRebounds(1);
        }
      }
    }
  }

  return {
    resultingPoints,
    secondsTaken,
  };
};

const addMinsToBoxScores = (items: TeamItems, seconds: number) => {
  items.starters.forEach((player) => {
    const bs = items.boxScores.get(player);

    if (!bs) {
      console.error(player);
      throw new Error("Given invalid player");
    }

    bs.addMins(seconds / 60);
  });
};

export const simGame = (
  homeTeam: Team,
  awayTeam: Team,
  quarterMins: number
): GameResult => {
  const homeRoster = homeTeam.roster;
  const awayRoster = awayTeam.roster;

  const hBSTitle = `Vs ${awayTeam.abreviation}`;
  const homeBoxScores = new Map(
    homeTeam.roster.allPlayers.map((player: Player) => [
      player,
      new BoxScore(hBSTitle),
    ])
  );

  const aBSTitle = ` @ ${homeTeam.abreviation}`;
  const awayBoxScores = new Map(
    awayTeam.roster.allPlayers.map((player: Player) => [
      player,
      new BoxScore(aBSTitle),
    ])
  );

  const homeStarters = homeRoster.starters;
  const awayStarters = awayRoster.starters;

  const homeLocs = new CourtLocations(homeStarters);
  const awayLocs = new CourtLocations(awayStarters);

  // creates TeamItems for both teams
  const homeItems = {
    starters: homeStarters,
    boxScores: homeBoxScores,
    locations: homeLocs,
  };

  const awayItems = {
    starters: awayStarters,
    boxScores: awayBoxScores,
    locations: awayLocs,
  };

  let homeScore = 0;
  let awayScore = 0;

  // determines if home starts with ball
  let homeHasBall = Math.floor(Math.random() * 2) == 1;

  for (let quarter = 1; quarter <= 4; quarter++) {
    let secondsLeftInQuarter = quarterMins * 60;
    let consecSecs = 0;
    while (secondsLeftInQuarter > 0) {
      const offItems = homeHasBall ? homeItems : awayItems;
      const defItems = homeHasBall ? awayItems : homeItems;

      const possession = playPossession(offItems, defItems);
      secondsLeftInQuarter -= possession.secondsTaken;
      if (homeHasBall) {
        homeScore += possession.resultingPoints;
      } else {
        awayScore += possession.resultingPoints;
      }
      homeHasBall = !homeHasBall;

      consecSecs += possession.secondsTaken;

      if (Math.floor(Math.random() * consecSecs) > 400) {
        addMinsToBoxScores(homeItems, consecSecs);
        addMinsToBoxScores(awayItems, consecSecs);

        homeItems.starters = homeRoster.getSubs();
        awayItems.starters = awayRoster.getSubs();

        homeItems.locations.addPlayers(homeItems.starters);
        awayItems.locations.addPlayers(awayItems.starters);

        consecSecs = 0;
      }
    }
  }

  const addBS = (players: Player[], boxScores: Map<Player, BoxScore>) => {
    players.forEach((player: Player) => {
      const bs = boxScores.get(player);

      if (!bs) {
        console.error(player);
        throw new Error("Given invalid player");
      }

      player.addBoxScore(bs);
    });
  };

  addBS(homeRoster.allPlayers, homeBoxScores);
  addBS(awayRoster.allPlayers, awayBoxScores);

  return {
    homeBoxScores,
    awayBoxScores,
    homeScore,
    awayScore,
  };
};
