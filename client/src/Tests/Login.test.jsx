import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "../pages/Login.jsx";
import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../Store/Store"; 

describe("Login Component", () => {
  const renderWithProviders = (ui) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );
  };

  it("should render the login form title", () => {
    renderWithProviders(<Login />);
    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toBeInTheDocument();
  });

  it("should have email input", () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
  });

  it("should have password input", () => {
    renderWithProviders(<Login />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  it("should have login button", () => {
    renderWithProviders(<Login />);
    const button = screen.getByRole("button", { name: /login/i });
    expect(button).toBeInTheDocument();
  });
});
