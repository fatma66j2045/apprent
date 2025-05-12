import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ManageRequests from "../pages/ManageRequests";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Store/usersSlice";
import '@testing-library/jest-dom';


// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          _id: "1",
          equipmentName: "Excavator",
          customerName: "John Doe",
          rentalDuration: "3 days",
          totalCost: 300,
          status: "pending",
        },
      ]),
  })
);

const mockStore = configureStore({
  reducer: {
    users: userReducer,
  },
  preloadedState: {
    users: {
      user: {
        _id: "test-user-id",
        role: "owner",
      },
    },
  },
});

describe("ManageRequests Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  const renderComponent = () =>
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <ManageRequests />
        </MemoryRouter>
      </Provider>
    );

  it("should render the Manage Rental Requests heading", async () => {
    renderComponent();
    const heading = await screen.findByText(/Manage Rental Requests/i);
    expect(heading).toBeInTheDocument();
  });

  it("should show request table when data is returned", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Excavator/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
  });

  it("should show 'No rental requests yet' if API returns empty array", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve([]) })
    );
    renderComponent();
    const emptyMessage = await screen.findByText(/no rental requests yet/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});
