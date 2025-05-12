import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Profile from "../pages/Profile";
import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../Store/Store";

// Mock localStorage with sample user
beforeEach(() => {
  const user = { _id: "12345", name: "Anthony", role: "customer" };
  localStorage.setItem("user", JSON.stringify(user));
});

// Helper to render with providers
const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("Profile Component", () => {
  it("should render the Profile heading", () => {
    renderWithProviders(<Profile />);
    const heading = screen.getByRole("heading", { name: /my profile/i });
    expect(heading).toBeInTheDocument();
  });

  it("should have an input for name", () => {
    renderWithProviders(<Profile />);
    const nameInput = screen.getByDisplayValue("Anthony");
    expect(nameInput).toBeInTheDocument();
  });

  it("should have a button to update name", () => {
    renderWithProviders(<Profile />);
    const button = screen.getByRole("button", { name: /update name/i });
    expect(button).toBeInTheDocument();
  });

  it("should have inputs for changing password", () => {
    renderWithProviders(<Profile />);
expect(screen.getByPlaceholderText("Old Password")).toBeInTheDocument();
expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
expect(screen.getByPlaceholderText("Confirm New Password")).toBeInTheDocument();

  });
});
