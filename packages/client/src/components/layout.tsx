import React from "react";
import { Box, Grid } from "@chakra-ui/react";
import { SideBar } from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Grid templateColumns="120px auto">
      <SideBar />
      <Box margin="30">{children}</Box>
    </Grid>
  );
};

export default Layout;
