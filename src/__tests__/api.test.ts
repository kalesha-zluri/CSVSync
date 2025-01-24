import {api} from "../api";
import { axiosInstance } from "../api";
import { TransactionFormData } from "../types";

let apiSpy;

describe("Transactions API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for getTransactions
  it("should call axiosInstance.get with correct parameters in getTransactions", async () => {
    apiSpy = jest.spyOn(axiosInstance, "get");
    apiSpy.mockResolvedValue({ data: [] });

    await api.getTransactions();

    expect(apiSpy).toBeCalledTimes(1);
    expect(apiSpy).toBeCalledWith("/get", {
      params: { page: 1, limit: 10 },
    });
  });

  // Test for addTransaction
  it("should call axiosInstance.post with correct data in addTransaction", async () => {
    apiSpy = jest.spyOn(axiosInstance, "post");
    apiSpy.mockResolvedValue({ data: { success: true } });

    const transaction: TransactionFormData = {
      date: "01-12-2023",
      description: "Test Transaction",
      amount: "100",
      currency: "USD",
    };

    const result = await api.addTransaction(transaction);

    expect(apiSpy).toBeCalledTimes(1);
    expect(apiSpy).toBeCalledWith("/add", transaction);
    expect(result).toEqual({ success: true });
  });

  // Test for updateTransaction
  it("should call axiosInstance.put with correct data in updateTransaction", async () => {
    apiSpy = jest.spyOn(axiosInstance, "put");
    apiSpy.mockResolvedValue({ data: { success: true } });

    const id = 123;
    const transaction = {
      date: "2023-12-01",
      description: "Updated Description",
      amount: "200",
      currency: "EUR",
    };

    const result = await api.editTransaction(id, transaction);

    expect(apiSpy).toBeCalledTimes(1);
    expect(apiSpy).toBeCalledWith(`/edit/${id}`, transaction);
    expect(result).toEqual({ success: true });
  });

  // Test for deleteTransaction
  it("should call axiosInstance.delete with correct ID in deleteTransaction", async () => {
    apiSpy = jest.spyOn(axiosInstance, "delete");
    apiSpy.mockResolvedValue({ data: { success: true } });

    const id = 123;

    const result = await api.deleteTransaction(id);

    expect(apiSpy).toBeCalledTimes(1);
    expect(apiSpy).toBeCalledWith(`/delete/${id}`);
    expect(result).toEqual({ success: true });
  });

  // Test for uploadTransactions
  it("should call axiosInstance.post with correct form data in uploadTransactions", async () => {
    apiSpy = jest.spyOn(axiosInstance, "post");
    apiSpy.mockResolvedValue({ data: { success: true } });

    const file = new File(["test content"], "test.csv", {
      type: "text/csv",
    });

    const result = await api.uploadCSV(file);

    expect(apiSpy).toBeCalledTimes(1);
    expect(apiSpy).toBeCalledWith("/upload", expect.any(FormData), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    expect(result).toEqual({ success: true });
  });

  //test for api.deleteMultipleTransactions
    it("should call axiosInstance.delete with correct data in deleteMultipleTransactions", async () => {
        apiSpy = jest.spyOn(axiosInstance, "delete");
        apiSpy.mockResolvedValue({ data: { success: true } });
    
        const ids = [1, 2, 3];
    
        const result = await api.deleteMultipleTransactions(ids);
    
        expect(apiSpy).toBeCalledTimes(1);
        expect(apiSpy).toBeCalledWith("/delete-multiple", { data: { ids } });
        expect(result).toEqual({ success: true });
    });
});
