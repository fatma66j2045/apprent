import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../Store/Store";

describe("AdminDashboard Component", () => {
  const renderWithProviders = (ui) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );
  };

  it("should render the Welcome Owner heading", () => {
    renderWithProviders(<AdminDashboard />);
    const heading = screen.getByRole("heading", { name: /welcome owner/i });
    expect(heading).toBeInTheDocument();
  });

  it("should display the subtitle text", () => {
    renderWithProviders(<AdminDashboard />);
    const text = screen.getByText(/manage your tools, customers, and rental requests here/i);
    expect(text).toBeInTheDocument();
  });

  it("should render the Location Info heading", () => {
    renderWithProviders(<AdminDashboard />);
    const locationHeading = screen.getByRole("heading", { name: /current location & place info/i });
    expect(locationHeading).toBeInTheDocument();
  });
});
