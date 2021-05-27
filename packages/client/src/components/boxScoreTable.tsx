import React from "react";
import {
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { Player } from "@bball/simulation/src";

const BoxScoreTable: React.FC<{ player: Player }> = ({ player }) => {
  return (
    <TableContainer>
      <Table bg="bball.background_light">
        <Thead>
          <Tr>
            <Th>PTS</Th>
            <Th>RBD</Th>
            <Th>AST</Th>
            <Th>BLK</Th>
            <Th>STL</Th>
            <Th>FGA</Th>
            <Th>FGM</Th>
            <Th>3PA</Th>
            <Th>3PM</Th>
            <Th>FTA</Th>
            <Th>FTM</Th>
          </Tr>
        </Thead>
        <Tbody>
          {player.seasonStats.map((seasonStat, idx) => (
            <Tr key={idx}>
              {seasonStat.avg.map((stat) => (
                <Td>{stat.toFixed(2)}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default BoxScoreTable;
