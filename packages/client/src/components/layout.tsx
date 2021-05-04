import React from "react";
import { Grid } from "@chakra-ui/react";
import "./layout.css";
import { SideBar } from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Grid templateColumns="120px auto" gap={4}>
      <SideBar></SideBar>
      <main>{children}</main>
    </Grid>
  );
};

export default Layout;
