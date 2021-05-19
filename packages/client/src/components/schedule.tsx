import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Team } from "@bball/simulation/src";

type ScheduleProps = {
  team: Team;
  showGames: number;
};

const Schedule: React.FC<ScheduleProps> = ({ team, showGames }) => {
  const games = team.games.slice(0, showGames);

  return (
    <Table bg="white" size="sm" color="black">
      <Thead>
        <Tr>
          <Th>Game Title</Th>
          <Th>Score</Th>
        </Tr>
      </Thead>
      <Tbody>
        {games.map((game) => (
          <Tr key={game.title}>
            <Td>{game.title}</Td>
            <Td>{`${game.scores[0]} - ${game.scores[0]}`}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Schedule;
