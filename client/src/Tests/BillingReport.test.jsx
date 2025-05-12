import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BillingReport from "../pages/BillingReport.jsx";
import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";


beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Dummy user reducer for mocking
const mockStore = configureStore({
  reducer: {
    users: () => ({
      user: { role: "owner", _id: "test123" },
    }),
  },
});

describe("BillingReport Component", () => {
  const renderWithMockStore = () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <BillingReport />
        </MemoryRouter>
      </Provider>
    );
  };

  it("should render the Billing Report heading", () => {
    renderWithMockStore();
    const heading = screen.getByRole("heading", { name: /billing report/i });
    expect(heading).toBeInTheDocument();
  });

  it("should show either table or empty message", () => {
    renderWithMockStore();
    const emptyMessage = screen.queryByText(/no approved rentals/i);
    const table = screen.queryByRole("table");
    expect(emptyMessage || table).not.toBeNull();
  });
});
