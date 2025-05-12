import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../pages/Home.jsx";
import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../Store/Store";

// Mock fetch before each test
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            _id: "1",
            name: "Excavator",
            description: "Heavy duty digging machine",
            price: 500,
          },
        ]),
    })
  );
});

describe("Home Component", () => {
  const renderWithProviders = (ui) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );
  };

  it("should render the Browse Equipment heading", async () => {
    renderWithProviders(<Home />);
    const heading = await screen.findByText("Browse Equipment");
    expect(heading).toBeInTheDocument();
  });

  it("should display the platform title", async () => {
    renderWithProviders(<Home />);
    const text = await screen.findByText(
      "Tools and Heavy Equipment Rental Platform"
    );
    expect(text).toBeInTheDocument();
  });
});
