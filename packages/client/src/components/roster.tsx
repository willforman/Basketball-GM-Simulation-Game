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

const Roster: React.FC<{ team: Team }> = ({ team }) => {
  return (
    <Table variant="simple">
      <TableCaption>Roster for {team.name}</TableCaption>
      <Thead>
        <Tr>
          <Th>Name</Th>
        </Tr>
      </Thead>
      <Tbody>
        {team.roster.allPlayers.map((player: Player) => (
          <Tr>
            <Td>{player.name}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Roster;
