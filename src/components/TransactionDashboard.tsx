import { useEffect, useState } from "react";
import {
  Transaction,
  TransactionFormData,
  TransactionResponse,
} from "../types";
import { AxiosError } from "axios";
import { api } from "../api";
import { toast, Toaster } from "react-hot-toast";
import { Plus } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { TransactionList } from "./TransactionList";
import { Pagination } from "./Pagination";
import { TransactionForm } from "./TransactionForm";
import { convertErrorsToCSV, triggerDownloadBlob } from "../utils/csvDownload";

export function TransactionDashboard() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [transactionsPerPage, setTransactionsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    Transaction | undefined
  >();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchTransactions = async (
    page: number = pagination.currentPage,
    limit: number = transactionsPerPage
  ) => {
    try {
      setLoading(true);
      const response: TransactionResponse = await api.getTransactions(
        page,
        limit
      );
      setTransactions(response.transactions);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
      });
    } catch (error) {
      console.error("Fetch error", error);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [transactionsPerPage]);

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      const response = await api.uploadCSV(file);
      console.log(response);
      toast.success(response.message);
      fetchTransactions(pagination.currentPage);
    } catch (error: any) {
      if (!(error instanceof AxiosError)) {
        toast.error("Failed to upload file");
        console.error(error);
        return;
      }
      const { response, status } = error;
      if (status === 400) {
        toast.error(
          response?.data?.error + " Check the downloaded file for errors"
        );
        // Handle error data and trigger CSV download
        if (response?.data?.data && response.data.data.length > 0) {
          const csvContent = convertErrorsToCSV(response.data.data);
          triggerDownloadBlob(csvContent, "upload_errors.csv");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      setShowForm(false);
      setLoading(true);
      const response = await api.addTransaction(data);
      toast.success(response.message);
      fetchTransactions(pagination.currentPage);
    } catch (error: any) {
      if (!(error instanceof AxiosError)) {
        toast.error("Failed to add transaction");
        console.error(error);
        return;
      }
      const { response, status } = error;
      if (status === 400 || status === 500) {
        toast.error(response?.data?.error || "Failed to add transaction");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = async (data: TransactionFormData) => {
    if (!selectedTransaction) return;
    try {
      setShowForm(false);
      setLoading(true);
      await api.editTransaction(selectedTransaction.id, data);
      toast.success("Transaction edited successfully");
      fetchTransactions(pagination.currentPage);
      setSelectedTransaction(undefined);
    } catch (error: any) {
      if (!(error instanceof AxiosError)) {
        toast.error("Failed to update transaction");
        console.error(error);
        return;
      }
      const { response, status } = error;
      if (status === 400) {
        toast.error(response?.data?.error || "Failed to update transaction");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      const response = await api.deleteTransaction(id);
      toast.success(response.message);
      fetchTransactions(pagination.currentPage);
    } catch (error: any) {
      if (!(error instanceof AxiosError)) {
        toast.error("Failed to delete transaction");
        console.error(error);
        return;
      }
      const { response, status } = error;
      if (status === 400) {
        toast.error(response?.data?.error || "Failed to delete transaction");
      }
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (ids: number[]) => {
    setSelectedIds(ids);
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;

    if (
      !window.confirm(`Are you sure you want to delete selected transactions?`)
    )
      return;

    try {
      const response = await api.deleteMultipleTransactions(selectedIds);
      toast.success(response.message);
      setSelectedIds([]);
      fetchTransactions(pagination.currentPage);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete transactions"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-700">
              Transactions
            </h1>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {selectedIds.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              )}
              <FileUpload onUpload={handleFileUpload} />
              <button
                onClick={() => {
                  setSelectedTransaction(undefined);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div
                  data-testid="loading-spinner"
                  className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"
                ></div>
                <div className="absolute inset-0 m-auto h-8 w-8 rounded-full border-t-2 border-b-2 border-transparent border-gray-400"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white shadow rounded-lg overflow-x-auto">
                <TransactionList
                  transactions={transactions}
                  onEdit={(transaction) => {
                    setSelectedTransaction(transaction);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteTransaction}
                  selectedIds={selectedIds}
                  onSelect={handleSelect}
                  onSelectAll={handleSelectAll}
                />
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  transactionsPerPage={transactionsPerPage}
                  onPageChange={(page) => fetchTransactions(page)}
                  onPageSizeChange={(size) => setTransactionsPerPage(size)}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {showForm && (
        <TransactionForm
          transaction={selectedTransaction}
          onSubmit={
            selectedTransaction ? handleEditTransaction : handleAddTransaction
          }
          onClose={() => {
            setShowForm(false);
            setSelectedTransaction(undefined);
          }}
        />
      )}
    </div>
  );
}
