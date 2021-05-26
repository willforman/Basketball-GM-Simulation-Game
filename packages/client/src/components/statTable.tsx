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

const StatTable: React.FC<{ player: Player }> = ({ player }) => {
  return (
    <TableContainer bg="bball.background_light">
      <Table>
        <Thead>
          <Tr>
            <Th>INS Shot</Th>
            <Th>MID Shot</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            <Tr>
              <Td>{player.stats.insideShot}</Td>
            </Tr>
          }
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default StatTable;
