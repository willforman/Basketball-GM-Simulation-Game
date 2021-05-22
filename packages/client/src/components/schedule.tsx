import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";
import { Game, League } from "@bball/simulation/src";

export const ScheduleWeek: React.FC<{ games: Game[] }> = ({ games }) => {
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
              <Td>{`${game.scores[0]} - ${game.scores[1]}`}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const WeekInput: React.FC<{
  numWeeks: number;
  setWeek: React.Dispatch<React.SetStateAction<number>>;
}> = ({ numWeeks, setWeek }) => {
  return (
    <Box>
      <NumberInput
        defaultValue={1}
        min={1}
        max={numWeeks}
        onChange={(week: string) => setWeek(parseInt(week))}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Box>
  );
};

const Schedule: React.FC<{ league: League }> = ({ league }) => {
  const [week, setWeek] = useState(1);

  return (
    <Box>
      <Text>Week:</Text>
      <WeekInput numWeeks={league.regularSeason.numWeeks} setWeek={setWeek} />
      <ScheduleWeek games={league.regularSeason.getWeekGames(week - 1)} />
    </Box>
  );
};

export default Schedule;
