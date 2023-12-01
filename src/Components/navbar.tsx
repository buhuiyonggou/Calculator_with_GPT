import React from "react";
import "./navbar.css";
import SpreadSheetClient from "../Engine/SpreadSheetClient";
import SpreadSheet from "./SpreadSheet";

interface NavbarProps {
  returnLoginPage: () => void;
  serverSelector: (buttonName: string) => void;
  serverSelected: string;
}

const Navbar: React.FC<NavbarProps> = ({
  returnLoginPage,
  serverSelector,
  serverSelected,
}) => {
  const handlechatroom = () => {
    document.getElementById("chatwindow")!.style.display = "flex";
  };

  const handlechatgpt = () => {
    document.getElementById("chatgptwindow")!.style.display = "flex";
  };

  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    return null;
  }

  //
  // the callback that will take the name of the button and called serverSelector
  function onButtonClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const buttonName = event.currentTarget.innerText;
    serverSelector(buttonName);
  } // onButtonClick

  return (
    <div className="navbar">
      <div className="server-display">
        <div className="green-circle"></div>
        {serverSelected}
      </div>
      <div className="topnav">
        <a className="active" href="#" onClick={returnLoginPage}>
          Home
        </a>
        <a href="#" id="chatroom" onClick={handlechatroom}>
          ChatRoom
        </a>
        <a href="#" id="chatgpt" onClick={handlechatgpt}>
          ChatGPT
        </a>
        <div className="dropdown">
          <a className="dropbtn">Server</a>
          <div className="dropdown-content">
            <a href="#" onClick={onButtonClick}>
              localhost
            </a>
            <a href="#" onClick={onButtonClick}>
              renderhost
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
