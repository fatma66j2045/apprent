// src/Tests/AddEquipment.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom"; // Fix for useNavigate
import { configureStore } from "@reduxjs/toolkit";
import AddEquipment from "../pages/AddEquipment";
import userReducer from "../Store/usersSlice"; 
import "@testing-library/jest-dom";




const mockStore = configureStore({
  reducer: { users: userReducer },
  preloadedState: {
    users: {
      user: { role: "owner", _id: "test-user-id" },
    },
  },
});

const renderWithProviders = () =>
  render(
    <Provider store={mockStore}>
      <MemoryRouter> {/* wrap with router */}
        <AddEquipment />
      </MemoryRouter>
    </Provider>
  );

describe("AddEquipment Component", () => {
  it("should render the Manage Equipment heading", () => {
    renderWithProviders();
    const heading = screen.getByRole("heading", { name: /manage equipment/i });
    expect(heading).toBeInTheDocument();
  });

  it("should show Add Equipment button", () => {
    renderWithProviders();
    const addButton = screen.getByRole("button", { name: /\+ add equipment/i });
    expect(addButton).toBeInTheDocument();
  });

  it("should render the table headings", () => {
    renderWithProviders();
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/price/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/actions/i)).toBeInTheDocument();
  });
});
