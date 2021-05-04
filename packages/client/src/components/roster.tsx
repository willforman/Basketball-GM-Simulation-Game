import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import { Player, Team } from "@bball/simulation/src";

const Roster: React.FC<{ team: Team; starters?: boolean }> = ({
  team,
  starters,
}) => {
  const players = starters ? team.roster.starters : team.roster.allPlayers;
  return (
    <Table variant="simple" bg="white" size="sm">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Rating</Th>
        </Tr>
      </Thead>
      <Tbody>
        {players.map((player: Player) => (
          <Tr key={player.id}>
            <Td>{player.name}</Td>
            <Td>{player.rating}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Roster;
