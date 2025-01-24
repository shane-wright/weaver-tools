import React from "react";
import { render, screen, act } from "@testing-library/react"; // Import act
import "@testing-library/jest-dom";
import ChatModal from "./ChatModal";

describe("ChatModal", () => {
  it("renders the floating button", () => {
    render(<ChatModal />);
    const button = screen.getByRole("button", { name: /add/i });
    expect(button).toBeInTheDocument();
  });

  it("opens the modal when the button is clicked", async () => {
    render(<ChatModal />);
    const button = screen.getByRole("button", { name: /add/i });

    // Wrap state updates in act(...)
    await act(async () => {
      button.click();
    });

    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", async () => {
    render(<ChatModal />);
    const button = screen.getByRole("button", { name: /add/i });

    // Open the modal
    await act(async () => {
      button.click();
    });

    const closeButton = screen.getByRole("button", { name: /close/i });

    // Close the modal
    await act(async () => {
      closeButton.click();
    });

    const modal = screen.queryByRole("dialog");
    expect(modal).not.toBeInTheDocument();
  });
});