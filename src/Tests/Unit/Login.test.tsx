import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPageComponent from "../../Components/LoginPageComponent";
import SpreadSheetClient from "../../Engine/SpreadSheetClient";

const spreadSheetClient = new SpreadSheetClient("documents", "");

describe("LoginPageComponent", () => {
  // Test for rendering the component
  it("renders the login form", () => {
    render(<LoginPageComponent spreadSheetClient={spreadSheetClient} />);
    expect(screen.getByPlaceholderText(/User name/i)).toBeInTheDocument();
  });

  // Test for input field interaction
  it("allows entering username", () => {
    render(<LoginPageComponent spreadSheetClient={spreadSheetClient} />);
    const input = screen.getByPlaceholderText(/User name/i);
    fireEvent.change(input, { target: { value: "testUser" } });
    expect(input).toHaveValue("testUser");
  });

  it("displays a message if no username is provided", () => {
    render(<LoginPageComponent spreadSheetClient={spreadSheetClient} />);
    const input = screen.getByPlaceholderText(/User name/i);

    fireEvent.keyPress(input, { key: "Enter", code: 13 });

    expect(
      screen.getByText(/You must be logged in to access the documents!/i)
    ).toBeInTheDocument();
  });

  it("removes the login message when typing a username without pressing Enter", () => {
    render(<LoginPageComponent spreadSheetClient={spreadSheetClient} />);
    const input = screen.getByPlaceholderText(/User name/i);

    fireEvent.change(input, { target: { value: "testUser" } });

    // Assuming the message is initially present
    expect(
      screen.getByText(/You must be logged in to access the documents!/i)
    ).toBeInTheDocument();
  });

  it("raises an alert if Enter is pressed without a username", () => {
    window.alert = jest.fn(); // Mock alert

    render(<LoginPageComponent spreadSheetClient={spreadSheetClient} />);
    const input = screen.getByPlaceholderText(/User name/i);
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(window.alert).toHaveBeenCalledWith("Please enter a user name");
  });

  it("allows the user to log out", async () => {
    render(<LoginPageComponent spreadSheetClient={spreadSheetClient} />);

    // Correctly select the input based on the actual placeholder text
    const input = screen.getByPlaceholderText("User name"); // Ensure this matches the actual placeholder text in your component

    // Simulate login
    fireEvent.change(input, { target: { value: "user666" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // Wait for the logout button to appear and click it
    const logoutButton = await screen.findByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);
  });
});
