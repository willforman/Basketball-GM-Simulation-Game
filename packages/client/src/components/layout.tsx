import React from "react";
import { Box, Grid } from "@chakra-ui/react";
import { SideBar } from "./sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Grid templateColumns="120px auto">
      <SideBar />
      <Box
        padding="30"
        bg="bball.background"
        overflowY="auto"
        height="100%"
        maxH="100vh"
      >
        {children}
      </Box>
    </Grid>
  );
};

export default Layout;
