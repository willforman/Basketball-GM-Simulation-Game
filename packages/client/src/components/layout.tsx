import React from "react";
import { useLeague } from "../context/league";
import "./layout.css";
import { SideBar } from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // const leagueContext = useLeague();

  // if (leagueContext.league == null) {
  //   return <h1>Must select league first</h1>;
  // }

  return (
    <>
      <SideBar></SideBar>
      <main>{children}</main>
    </>
  );
};
