import React from "react";
import { Grid } from "@chakra-ui/react";
import { useLeague } from "../context/league";
import "./layout.css";
import { SideBar } from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={0}>
      <SideBar></SideBar>
      <main>{children}</main>
    </Grid>
  );
};
