import React from "react";
import "./layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  return <div>{props.children}</div>;
};

export default Layout;
