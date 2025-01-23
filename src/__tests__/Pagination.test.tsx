import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "../components/Pagination";

describe("Pagination", () => {
  const mockOnPageChange = jest.fn();
  const mockOnPageSizeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders pagination buttons and page size selector correctly", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        transactionsPerPage={10}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("Last")).toBeInTheDocument();
    expect(screen.getByText("Rows per page")).toBeInTheDocument();
  });

  it("calls onPageChange with correct page number when pagination buttons are clicked", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        transactionsPerPage={10}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    fireEvent.click(screen.getByText("First"));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText("Previous"));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);

    fireEvent.click(screen.getByText("Next"));
    expect(mockOnPageChange).toHaveBeenCalledWith(6);

    fireEvent.click(screen.getByText("Last"));
    expect(mockOnPageChange).toHaveBeenCalledWith(10);
  });

  it("calls onPageSizeChange with correct page size when page size is changed", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        transactionsPerPage={10}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "20" } });
    expect(mockOnPageSizeChange).toHaveBeenCalledWith(20,true);
  });

  it("disables pagination buttons correctly", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        transactionsPerPage={10}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    expect(screen.getByTestId("first-page")).toBeDisabled();
    expect(screen.getByTestId("previous-page")).toBeDisabled();
    expect(screen.getByTestId("next-page")).toBeDisabled();
    expect(screen.getByTestId("last-page")).toBeDisabled();
  });
});
