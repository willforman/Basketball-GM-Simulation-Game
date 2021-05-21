import React from "react";
import {
  Playoffs,
  PlayoffSeries,
  ConfRound,
  Round,
} from "@bball/simulation/src";
import { Box, Text, VStack, Divider, HStack } from "@chakra-ui/react";

const SeriesComp: React.FC<{ series: PlayoffSeries }> = ({ series }) => {
  return (
    <Box bg="bball.background_light" width="28">
      <VStack>
        <Text>{`${series.team1.name} - ${series.wins1}`}</Text>
        <Divider />
        <Text>{`${series.team2.name} - ${series.wins2}`}</Text>
      </VStack>
    </Box>
  );
};

const RoundComp: React.FC<{ round: ConfRound }> = ({ round }) => {
  return (
    <VStack>
      {round.series.map((series: PlayoffSeries) => (
        <SeriesComp
          series={series}
          key={`${series.team1.name}${series.team2.name}`}
        />
      ))}
    </VStack>
  );
};

const Bracket: React.FC<{ playoffs: Playoffs }> = ({ playoffs }) => {
  return (
    <HStack>
      {playoffs.rounds.map((round: Round, idx: number) => (
        <VStack key={`${idx}`}>
          <Text>East</Text>
          <RoundComp round={round.east} />
          <Text>West</Text>
          <RoundComp round={round.west} />
        </VStack>
      ))}
      {playoffs.championship ? (
        <SeriesComp series={playoffs.championship} />
      ) : null}
    </HStack>
  );
};

export default Bracket;
