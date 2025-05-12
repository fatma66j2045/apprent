import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Register from "../pages/Register.jsx";
import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../Store/Store";

describe("Register Component", () => {
  const renderWithProviders = (ui) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );
  };

  it("should render the title", () => {
    renderWithProviders(<Register />);
    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toBeInTheDocument();
  });

  it("should have name input", () => {
    renderWithProviders(<Register />);
    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toBeInTheDocument();
  });

  it("should have email input", () => {
    renderWithProviders(<Register />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
  });

  it("should have password input", () => {
    renderWithProviders(<Register />);
   const passwordInput = screen.getByLabelText(/^Password$/i);
    expect(passwordInput).toBeInTheDocument();
  });
});
