import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { Team } from "@bball/simulation/src";

type ScheduleProps = {
  team: Team;
  showGames: number;
};

const Schedule: React.FC<ScheduleProps> = ({ team, showGames }) => {
  const games = team.games.slice(0, showGames);

  return (
    <TableContainer>
      <Table variant="dark" bg="bball.background_light">
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
    </TableContainer>
  );
};

export default Schedule;
