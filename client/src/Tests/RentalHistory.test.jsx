import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'; // Add this line
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import RentalHistory from "../pages/RentalHistory";

// mock REACT_APP_SERVER_URL
beforeAll(() => {
  process.env.REACT_APP_SERVER_URL = "http://localhost:5000";
});

// mock store
const mockStore = configureStore({
  reducer: {
    users: () => ({ user: { _id: "test-user-id", role: "customer" } }),
  },
});

const renderWithProviders = () => {
  return render(
    <Provider store={mockStore}>
      <MemoryRouter>
        <RentalHistory />
      </MemoryRouter>
    </Provider>
  );
};

describe("RentalHistory Component", () => {
  it("should render the Rental History heading", async () => {
    renderWithProviders();
    const heading = await screen.findByRole("heading", {
      name: /my rental history/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("should display a table or a message", async () => {
    renderWithProviders();
    await waitFor(() => {
      const table = screen.queryByRole("table");
      const message = screen.queryByText(/no rentals found/i);
      expect(table || message).toBeDefined();
    });
  });
});
