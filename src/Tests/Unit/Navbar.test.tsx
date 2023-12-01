import React from "react";
import { render, fireEvent, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../../Components/navbar";

describe("Navbar Component", () => {
  const mockReturnLoginPage = jest.fn();
  const mockServerSelector = jest.fn();

  it("renders Navbar with all elements", () => {
    render(
      <Navbar
        returnLoginPage={mockReturnLoginPage}
        serverSelector={mockServerSelector}
        serverSelected="localhost"
      />
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("ChatRoom")).toBeInTheDocument();
    expect(screen.getByText("ChatGPT")).toBeInTheDocument();
    expect(screen.getByText("Server")).toBeInTheDocument();
  });

  it("calls returnLoginPage when Home is clicked", () => {
    render(
      <Navbar
        returnLoginPage={mockReturnLoginPage}
        serverSelector={mockServerSelector}
        serverSelected="localhost"
      />
    );

    // Check if the 'Home' link is present
    const homeLink = screen.getByText("Home");
    expect(homeLink).toBeInTheDocument();

    // Then fire the click event
    fireEvent.click(homeLink);
    expect(mockReturnLoginPage).toHaveBeenCalled();
  });

  it("calls serverSelector when renderhost is selected", () => {
    render(
      <Navbar
        returnLoginPage={mockReturnLoginPage}
        serverSelector={mockServerSelector}
        serverSelected="renderhost"
      />
    );
    const localhostElements = screen.getAllByText("renderhost");
    expect(localhostElements).toHaveLength(2);
  });

  it("calls serverSelector when localhost is selected", () => {
    render(
      <Navbar
        returnLoginPage={mockReturnLoginPage}
        serverSelector={mockServerSelector}
        serverSelected="localhost"
      />
    );
    const localhostElements = screen.getAllByText("localhost");
    expect(localhostElements).toHaveLength(2);
  });
});
