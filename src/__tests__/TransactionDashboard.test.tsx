import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TransactionDashboard } from "../components/TransactionDashboard";
import { api } from "../api";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
// Mock dependencies
jest.mock("../api");
jest.mock("react-hot-toast");
jest.mock("../components/FileUpload", () => ({
  FileUpload: ({ onUpload }: { onUpload: (file: File) => void }) => (
    <button onClick={() => onUpload(new File([], "test.csv"))}>
      Upload CSV
    </button>
  ),
}));
jest.mock("../utils/csvDownload", () => ({
  convertErrorsToCSV: jest.fn().mockReturnValue("mocked,csv,content"),
  triggerDownloadBlob: jest.fn(),
}));

// Mock child components
jest.mock("../components/TransactionList", () => ({
  TransactionList: ({
    transactions,
    onEdit,
    onDelete,
    onSelect,
    onSelectAll,
  }: any) => (
    <div data-testid="transaction-list">
      <button onClick={() => onEdit(transactions[0])}>Edit First</button>
      <button onClick={() => onDelete(transactions[0].id)}>Delete First</button>
      <button onClick={() => onSelect(transactions[0].id)}>Select First</button>
      <button onClick={() => onSelectAll([1, 2])}>Select All</button>
    </div>
  ),
}));

jest.mock("../components/Pagination", () => ({
  Pagination: ({ currentPage, onPageChange, onPageSizeChange }: any) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(currentPage + 1)}>Next Page</button>
      <button onClick={() => onPageSizeChange(20)}>Change Size</button>
    </div>
  ),
}));

jest.mock("../components/TransactionForm", () => ({
  TransactionForm: ({ onSubmit, onClose }: any) => (
    <div data-testid="transaction-form">
      <button onClick={() => onSubmit({ date: "2024-03-15", amount: "100" })}>
        Submit
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("TransactionDashboard", () => {
  const mockTransactions = [
    {
      id: 1,
      date: "15-03-2024",
      description: "Test Transaction",
      amount: "100",
      currency: "USD",
      amountInr: 8250,
    },
  ];

  const mockResponse = {
    transactions: mockTransactions,
    currentPage: 1,
    totalPages: 2,
    totalCount: 15,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API responses
    (api.getTransactions as jest.Mock).mockResolvedValue(mockResponse);
    (api.addTransaction as jest.Mock).mockResolvedValue({
      message: "Added successfully",
    });
    (api.editTransaction as jest.Mock).mockResolvedValue({
      message: "Updated successfully",
    });
    (api.deleteTransaction as jest.Mock).mockResolvedValue({
      message: "Deleted successfully",
    });
    (api.deleteMultipleTransactions as jest.Mock).mockResolvedValue({
      message: "Bulk deleted successfully",
    });
    (api.uploadCSV as jest.Mock).mockResolvedValue({
      message: "Uploaded successfully",
    });

    // Mock window.confirm
    window.confirm = jest.fn(() => true);
  });

  it("shows loading spinner initially", () => {
    render(<TransactionDashboard />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("fetches and displays transactions", async () => {
    render(<TransactionDashboard />);
    await waitFor(() => {
      expect(api.getTransactions).toHaveBeenCalledWith(1, 10);
      expect(screen.getByTestId("transaction-list")).toBeInTheDocument();
    });
  });

  it("handles file upload", async () => {
    render(<TransactionDashboard />);
    const uploadButton = screen.getByText("Upload CSV");
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(api.uploadCSV).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Uploaded successfully");
    });
  });

  it("handles add transaction", async () => {
    render(<TransactionDashboard />);

    // Click add transaction button
    const addButton = screen.getByText("Add Transaction");
    fireEvent.click(addButton);

    // Submit form
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.addTransaction).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Added successfully");
    });
  });

  it("handles edit transaction", async () => {
    render(<TransactionDashboard />);

    await waitFor(() => {
      const editButton = screen.getByText("Edit First");
      fireEvent.click(editButton);
    });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.editTransaction).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Transaction edited successfully"
      );
    });
  });

  it("handles delete transaction", async () => {
    render(<TransactionDashboard />);

    await waitFor(() => {
      const deleteButton = screen.getByText("Delete First");
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(api.deleteTransaction).toHaveBeenCalledWith(
        mockTransactions[0].id
      );
      expect(toast.success).toHaveBeenCalledWith("Deleted successfully");
    });
  });

  it("handles selection and bulk delete", async () => {
    render(<TransactionDashboard />);

    await waitFor(() => {
      const selectAllButton = screen.getByText("Select All");
      fireEvent.click(selectAllButton);
    });

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(api.deleteMultipleTransactions).toHaveBeenCalledWith([1, 2]);
      expect(toast.success).toHaveBeenCalledWith("Bulk deleted successfully");
    });
  });

  it("handles pagination", async () => {
    render(<TransactionDashboard />);

    await waitFor(() => {
      const nextPageButton = screen.getByText("Next Page");
      fireEvent.click(nextPageButton);
    });

    await waitFor(() => {
      expect(api.getTransactions).toHaveBeenCalledWith(2, 10);
    });
  });

  it("handles page size change", async () => {
    render(<TransactionDashboard />);

    await waitFor(() => {
      const changeSizeButton = screen.getByText("Change Size");
      fireEvent.click(changeSizeButton);
    });

    await waitFor(() => {
      expect(api.getTransactions).toHaveBeenCalledWith(1, 20);
    });
  });

  it("handles API errors", async () => {
    const error = new AxiosError();
    error.response = { data: { error: "Test error" }, status: 400 } as any;
    (api.getTransactions as jest.Mock).mockRejectedValue(error);

    render(<TransactionDashboard />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch transactions");
    });
  });

  it("closes form on close button click", async () => {
    render(<TransactionDashboard />);

    // Open form
    const addButton = screen.getByText("Add Transaction");
    fireEvent.click(addButton);

    // Close form
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId("transaction-form")).not.toBeInTheDocument();
    });
  });

  test("handles CSV upload success", async () => {
    (api.uploadCSV as jest.Mock).mockResolvedValue({
      message: "CSV uploaded successfully",
    });

    render(<TransactionDashboard />);

    const uploadButton = screen.getByText("Upload CSV");

    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("CSV uploaded successfully");
    });
  });

  test("handles CSV upload errors with error file download", async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Upload failed",
          data: [{ row: 1, error: "Invalid data" }],
        },
        status: 400,
      },
    };

    (api.uploadCSV as jest.Mock).mockRejectedValue(errorResponse);

    render(<TransactionDashboard />);

    // const file = new File(["test"], "test.csv", { type: "text/csv" });
    const uploadButton = screen.getByText("Upload CSV");

    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to upload file"
      );
    });
  });
});
