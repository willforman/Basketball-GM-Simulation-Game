import React from "react";
import { Team, League, PlayoffSeries, ConfRound } from "@bball/simulation/src";
import { Box, Text, VStack } from "@chakra-ui/react";

const Series: React.FC<{ series: PlayoffSeries }> = ({ series }) => {
  return (
    <Box bg="bball.background_light">
      <VStack>
        <Text>{series.team1.name}</Text>
        <Text>{series.team2.name}</Text>
      </VStack>
    </Box>
  );
};

const Round: React.FC<{ round: ConfRound }> = ({ round }) => {
  return (
    <VStack>
      {round.series.map((series: PlayoffSeries) => (
        <Series series={series} key={`${series.team1}${series.team2}`} />
      ))}
    </VStack>
  );
};

const Bracket: React.FC<{ league: League }> = ({ league }) => {
  return (
    <VStack>
      <Round round={league.playoffs.rounds[0].east} />
    </VStack>
  );
};

export default Bracket;
