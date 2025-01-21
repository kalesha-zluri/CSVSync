import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransactionForm } from "../components/TransactionForm";

describe("TransactionForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onClose: mockOnClose,
  };

  it("renders the form with empty fields for new transaction", () => {
    render(<TransactionForm {...defaultProps} />);

    expect(screen.getByText("Add Transaction")).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toHaveValue("");
    expect(screen.getByLabelText(/amount/i)).toHaveValue(null);
    expect(screen.getByLabelText(/currency/i)).toHaveValue("USD");
    expect(screen.getByLabelText(/date/i)).toHaveValue("");
  });

  it("renders the form with populated fields for existing transaction", () => {
    const transaction: any = {
      id: 1,
      description: "Test Transaction",
      amount: "100",
      currency: "EUR",
      date: "15-03-2024",
    };

    render(<TransactionForm {...defaultProps} transaction={transaction} />);

    expect(screen.getByText("Edit Transaction")).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toHaveValue(
      "Test Transaction"
    );
    expect(screen.getByLabelText(/amount/i)).toHaveValue(100);
    expect(screen.getByLabelText(/currency/i)).toHaveValue("EUR");
    expect(screen.getByLabelText(/date/i)).toHaveValue("2024-03-15");
  });

  it("calls onSubmit with form data when submitted", async () => {
    render(<TransactionForm {...defaultProps} />);

    await userEvent.type(
      screen.getByLabelText(/description/i),
      "New Transaction"
    );
    await userEvent.type(screen.getByLabelText(/amount/i), "500");
    await userEvent.selectOptions(screen.getByLabelText(/currency/i), "EUR");
    await userEvent.type(screen.getByLabelText(/date/i), "2024-03-20");

    fireEvent.submit(screen.getByRole("button", { name: /add/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      description: "New Transaction",
      amount: "500",
      currency: "EUR",
      date: "20-03-2024",
    });
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<TransactionForm {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when X button is clicked", () => {
    render(<TransactionForm {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", { name: /close/i, hidden: true })
    );

    expect(mockOnClose).toHaveBeenCalled();
  });
  
  it("updates form state when input values change", async () => {
    render(<TransactionForm {...defaultProps} />);

    const descriptionInput = screen.getByLabelText(/description/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const currencySelect = screen.getByLabelText(/currency/i);

    await userEvent.type(descriptionInput, "Updated Description");
    await userEvent.type(amountInput, "750");
    await userEvent.selectOptions(currencySelect, "GBP");

    expect(descriptionInput).toHaveValue("Updated Description");
    expect(amountInput).toHaveValue(750);
    expect(currencySelect).toHaveValue("GBP");
  });
});
