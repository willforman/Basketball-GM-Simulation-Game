import React from "react";
import {
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Player } from "@bball/simulation/src";
import { Link as GatsbyLink } from "gatsby";

const Roster: React.FC<{ players: Player[] }> = ({ players }) => {
  return (
    <TableContainer>
      <Table bg="bball.background_light">
        <Thead>
          <Tr>
            <Th color="gray.400">Name</Th>
            <Th>Pos</Th>
            <Th>Rat</Th>
            <Th>Pot</Th>
            <Th>Age</Th>
            <Th>Contract</Th>
          </Tr>
        </Thead>
        <Tbody>
          {players.map((player: Player) => (
            <Tr key={player.id}>
              <Td>
                <ChakraLink as={GatsbyLink} to="/player/">
                  {player.name}
                </ChakraLink>
              </Td>
              <Td>{player.posStr}</Td>
              <Td>{player.rating}</Td>
              <Td>{player.potential}</Td>
              <Td>{player.age}</Td>
              <Td>{`${player.contract.price.toFixed(2)}M`}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Roster;
