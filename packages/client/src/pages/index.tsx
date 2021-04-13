import React, { useState, useEffect } from "react";
import { League, buildLeague, Team, Player } from "@bball/simulation/src";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Button,
} from "@chakra-ui/react";

const Index: React.FC = () => {
  const [league, setLeague] = useState<League>();

  if (!league) {
    return (
      <div>
        <Button onClick={async () => setLeague(await buildLeague())}>
          Build
        </Button>
        <h1>League Loaded: no</h1>
      </div>
    );
  } else {
    return (
      <div>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Rating</Th>
            </Tr>
          </Thead>
          <Tbody>
            {league.teams.map((curr: Team) => {
              return (
                <Tr>
                  <Td>{curr.name}</Td>
                  <Td>{Math.round(curr.roster.rating)}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </div>
    );
  }
};

export default Index;
