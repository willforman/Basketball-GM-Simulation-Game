import React from "react";
import { Player } from "@bball/simulation/src";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

const Stats: React.FC<{ player: Player }> = ({ player }) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Rating</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>{player.rating}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default Stats;
