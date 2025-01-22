import { render, screen, fireEvent } from "@testing-library/react";
import { FileUpload } from "../components/FileUpload";

describe("FileUpload", () => {
  const mockOnUpload = jest.fn();
  window.alert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the upload button correctly", () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    expect(screen.getByText("Upload CSV")).toBeInTheDocument();
  });

  it("opens the modal when the upload button is clicked", () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    fireEvent.click(screen.getByText("Upload CSV"));
    expect(screen.getByText("Upload CSV File")).toBeInTheDocument();
  });

  it("validates file type and size correctly", () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    fireEvent.click(screen.getByText("Upload CSV"));

    const fileInput = screen.getByLabelText("file-upload");

    // Test invalid file type
    const invalidFile = new File(["content"], "invalid.txt", {
      type: "text/plain",
    });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    expect(window.alert).toHaveBeenCalledWith("Please upload a CSV file");

    // Test valid file type but invalid size
    const largeFile = new File(["a".repeat(1048577)], "large.csv", {
      type: "text/csv",
    });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    expect(window.alert).toHaveBeenCalledWith(
      "File size must be less than 1MB"
    );

    // Test valid file type and size
    const validFile = new File(["content"], "valid.csv", { type: "text/csv" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    expect(mockOnUpload).toHaveBeenCalledWith(validFile);
  });

  it("calls onUpload with the selected file", () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    fireEvent.click(screen.getByText("Upload CSV"));

    const fileInput = screen.getByLabelText("file-upload");
    const validFile = new File(["content"], "valid.csv", { type: "text/csv" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    expect(mockOnUpload).toHaveBeenCalledWith(validFile);
  });

  it("closes the modal after file upload", () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    fireEvent.click(screen.getByText("Upload CSV"));

    const fileInput = screen.getByLabelText("file-upload");
    const validFile = new File(["content"], "valid.csv", { type: "text/csv" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // Check that the modal is closed after file upload
    expect(screen.queryByText("Upload CSV File")).not.toBeInTheDocument();
  });
});
