import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatDialog from "./ChatDialog";

describe("ChatDialog", () => {
it("renders the floating button", () => {
    render(<ChatDialog />);
    const button = screen.getByRole("button", { name: /add/i });
    expect(button).toBeInTheDocument();
});

it("opens the modal when the button is clicked", async () => {
    render(<ChatDialog />);
    const button = screen.getByRole("button", { name: /add/i });
    
    await act(async () => {
    button.click();
    });

    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
});

it("closes the modal when the close button is clicked", async () => {
    render(<ChatDialog />);
    const button = screen.getByRole("button", { name: /add/i });
    
    await act(async () => {
    button.click();
    });

    const closeButton = screen.getByRole("button", { name: /close/i });
    
    await act(async () => {
    closeButton.click();
    });

    const modal = screen.queryByRole("dialog");
    expect(modal).not.toBeInTheDocument();
});
});

