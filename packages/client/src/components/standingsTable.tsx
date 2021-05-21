import React, { useState } from "react";
import {
  Table,
  Th,
  Tr,
  Td,
  TableContainer,
  Thead,
  Tbody,
  Box,
  Text,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { League, Team } from "@bball/simulation/src";
import { Link as GatsbyLink } from "gatsby";

const StandingsTable: React.FC<{ teams: Team[] }> = ({ teams }) => {
  console.log("render table");

  return (
    <TableContainer>
      <Table bg="bball.background_light">
        <Thead>
          <Tr>
            <Th>Team</Th>
            <Th>Wins</Th>
            <Th>Losses</Th>
            <Th>Pct</Th>
          </Tr>
        </Thead>
        <Tbody>
          {teams.map((team: Team, idx: number) => (
            <Tr key={team.abreviation}>
              <Td>
                <ChakraLink as={GatsbyLink} to="/team">{`${idx + 1})\t${
                  team.name
                }`}</ChakraLink>
              </Td>
              <Td>{team.wins}</Td>
              <Td>{team.losses}</Td>
              <Td>{team.winPct.toFixed(2)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const Standings: React.FC<{ league: League }> = ({ league }) => {
  const [confIdx, setConfIdx] = useState(0);
  const confs = league.standings;

  console.log("render standings");

  return (
    <Box>
      <Button
        bg="bball.main"
        onClick={() => {
          setConfIdx(confIdx == 0 ? 1 : 0);
        }}
      >{`Show: ${confIdx === 0 ? "East" : "West"}`}</Button>
      <StandingsTable teams={confs[confIdx]} />
    </Box>
  );
};

export default Standings;
