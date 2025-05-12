import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Cart from "../pages/Cart";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../Store/Store";

describe("Cart Component", () => {
  const renderWithProviders = (ui) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );
  };

  it("should render the cart heading", () => {
    renderWithProviders(<Cart />);
    const heading = screen.getByRole("heading", { name: /your rental cart/i });
    expect(heading).toBeInTheDocument();
  });

  it("should show a total price or empty cart message", () => {
    renderWithProviders(<Cart />);
    const text = screen.getByText(/total|empty/i, { exact: false });
    expect(text).toBeInTheDocument();
  });

});
