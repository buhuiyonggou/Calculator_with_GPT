import React from "react";
import "./navbar.css";
import SpreadSheetClient from "../Engine/SpreadSheetClient";
import SpreadSheet from "./SpreadSheet";

interface NavbarProps {
    returnLoginPage: () => void;
}

  const handlechatroom = () => {
    document.getElementById('chatwindow')!.style.display = 'flex';
  }

const Navbar: React.FC<NavbarProps> = ({ returnLoginPage }) => {
    const handlechatroom = () => {
        document.getElementById('chatwindow')!.style.display = 'flex';
    }

    const handlechatgpt = () => {
        document.getElementById('chatgptwindow')!.style.display = 'flex';
    }

    return (
        <div className="navbar">
            <div className="topnav">
                <a className="active" href="#" onClick={returnLoginPage}>Home</a>
                <a href="#" id="chatroom" onClick={handlechatroom}>ChatRoom</a>
                <a href="#" id="chatgpt" onClick={handlechatgpt}>ChatGPT</a>
                <a href="#about">About</a>
            </div>
        </div>
    );
}

export default Navbar;