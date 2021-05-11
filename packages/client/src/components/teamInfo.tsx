import React from "react";
import { Box, Text, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { Team } from "@bball/simulation/src";
import * as Logos from "react-nba-logos";

const TeamInfo: React.FC<{ team: Team }> = ({ team }) => {
  const Logo = Logos[team.abreviation.toUpperCase()];
  return (
    <Box>
      <Logo></Logo>
      <Text fontWeight="extrabold" fontSize="3xl">
        {team.name}
      </Text>
      <Text
        fontWeight="bold"
        fontSize="xl"
      >{`Record: ${team.wins} - ${team.losses}`}</Text>
      <Stat>
        <StatLabel fontSize="lg">Cap Space</StatLabel>
        <StatNumber>{`$${team.cap.currPay.toFixed(2)}M`}</StatNumber>
      </Stat>
    </Box>
  );
};

export default TeamInfo;
