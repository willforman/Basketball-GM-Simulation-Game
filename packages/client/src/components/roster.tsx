import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Player, Team } from "@bball/simulation/src";
import { Link as GatsbyLink } from "gatsby";

const Roster: React.FC<{ team: Team; showAllPlayers?: boolean }> = ({
  team,
  showAllPlayers,
}) => {
  const players = team.roster.starters;

  if (showAllPlayers) {
    players.push(...team.roster.bench);
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Position</Th>
          <Th>Rating</Th>
          <Th>Potential</Th>
          <Th>Contract</Th>
        </Tr>
      </Thead>
      <Tbody>
        {players.map((player: Player) => (
          <Tr key={player.id}>
            <Td>
              <ChakraLink as={GatsbyLink} to="/player/" state={{ player }}>
                {player.name}
              </ChakraLink>
            </Td>
            <Td>{player.pos}</Td>
            <Td>{player.rating}</Td>
            <Td>{player.potential}</Td>
            <Td>{`${player.contract.price.toFixed(2)}M`}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Roster;
