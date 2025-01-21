import { render, screen, fireEvent } from "@testing-library/react";
import { TransactionList } from "../components/TransactionList";


describe("TransactionList", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const sampleTransactions: any[] = [
    {
      id: 1,
      date: "15-03-2024",
      description: "Test Transaction 1",
      amount: "100.50",
      currency: "USD",
      amountInr: 8250.75,
    },
    {
      id: 2,
      date: "16-03-2024",
      description: "Test Transaction 2",
      amount: "200.75",
      currency: "EUR",
      amountInr: 18067.5,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the table headers correctly", () => {
    render(
      <TransactionList
        transactions={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Amount(INR)")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders transaction data correctly", () => {
    render(
      <TransactionList
        transactions={sampleTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Check if transactions are rendered
    expect(screen.getByText("Test Transaction 1")).toBeInTheDocument();
    expect(screen.getByText("Test Transaction 2")).toBeInTheDocument();

    // Check date formatting
    expect(screen.getByText("15 Mar 2024")).toBeInTheDocument();
    expect(screen.getByText("16 Mar 2024")).toBeInTheDocument();

    // Check amount formatting
    expect(screen.getByText("$ 100.50")).toBeInTheDocument();
    expect(screen.getByText("€ 200.75")).toBeInTheDocument();

    // Check INR amount formatting
    expect(screen.getByText("₹ 8,250.75")).toBeInTheDocument();
    expect(screen.getByText("₹ 18,067.50")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(
      <TransactionList
        transactions={sampleTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByRole("button", { name: "" });
    fireEvent.click(editButtons[0]); // Click first edit button

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(sampleTransactions[0]);
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <TransactionList
        transactions={sampleTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteButtons[1]); // Click first delete button

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(sampleTransactions[0].id);
  });

  it("handles empty transactions array", () => {
    render(
      <TransactionList
        transactions={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const tbody = screen.getByTestId("transaction-tbody");
    expect(tbody.children).toHaveLength(0);
  });

  it("applies hover styles to rows", () => {
    render(
      <TransactionList
        transactions={sampleTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const rows = screen.getAllByRole("row").slice(1); // Skip header row
    rows.forEach((row) => {
      expect(row).toHaveClass("hover:bg-gray-50");
      expect(row).toHaveClass("transition-colors");
    });
  });

  it("truncates long descriptions", () => {
    const longDescription = "A".repeat(100);
    const transactionsWithLongDesc: any[] = [
      {
        ...sampleTransactions[0],
        description: longDescription,
      },
    ];

    render(
      <TransactionList
        transactions={transactionsWithLongDesc}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const descriptionCell = screen.getByTitle(longDescription);
    expect(descriptionCell).toHaveClass("truncate");
    expect(descriptionCell).toHaveClass("max-w-xs");
  });
});
