import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Player, Team } from "@bball/simulation/src";

const Roster: React.FC<{ team: Team; starters?: boolean }> = ({
  team,
  starters,
}) => {
  const players = starters ? team.roster.starters : team.roster.allPlayers;
  return (
    <Table variant="simple" bg="white" size="sm" marginBottom="2">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Rating</Th>
          <Th>Pos</Th>
        </Tr>
      </Thead>
      <Tbody>
        {players.map((player: Player) => (
          <Tr key={player.id}>
            <Td>{player.name}</Td>
            <Td>{player.rating}</Td>
            <Td>{player.pos}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Roster;
