import React from "react";
import { Player } from "@bball/simulation/src";
import {
  Table,
  Th,
  Td,
  Thead,
  Tbody,
  Tr,
  TableContainer,
} from "@chakra-ui/react";

export const OffTable: React.FC<{ player: Player }> = ({ player }) => {
  return (
    <TableContainer bg="bball.background_light">
      <Table>
        <Thead>
          <Tr>
            <Th>Offense Stats</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Th>Ins</Th> <Td>{player.stats.insideShot}</Td>
          </Tr>
          <Tr>
            <Th>Mid</Th> <Td>{player.stats.midShot}</Td>
          </Tr>
          <Tr>
            <Th>3pt</Th> <Td>{player.stats.threePtShot}</Td>
          </Tr>
          <Tr>
            <Th>Pass</Th> <Td>{player.stats.passing}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export const DefTable: React.FC<{ player: Player }> = ({ player }) => {
  return (
    <TableContainer bg="bball.background_light">
      <Table>
        <Thead>
          <Tr>
            <Th>Defense Stats</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Th>Ins</Th> <Td>{player.stats.insideDefense}</Td>
          </Tr>
          <Tr>
            <Th>Mid</Th> <Td>{player.stats.midDefense}</Td>
          </Tr>
          <Tr>
            <Th>3pt</Th> <Td>{player.stats.threePtDefense}</Td>
          </Tr>
          <Tr>
            <Th>Stl</Th> <Td>{player.stats.stealing}</Td>
          </Tr>
          <Tr>
            <Th>Reb</Th> <Td>{player.stats.rebounding}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};
