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
import { BoxScore } from "@bball/simulation/src";

const BoxScoreTable: React.FC<{ statLists: number[][] }> = ({ statLists }) => {
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
            <Th>Mins</Th>
          </Tr>
        </Thead>
        <Tbody>
          {statLists.map((statList, idx) => (
            <Tr key={idx}>
              {statList.map((stat) => (
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
