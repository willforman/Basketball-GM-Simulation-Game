import React from "react";
import "./layout.css";
import { SideBar } from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <SideBar></SideBar>
      <main>{children}</main>
    </>
  );
};
