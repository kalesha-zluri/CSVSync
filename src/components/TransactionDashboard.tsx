import { useEffect, useState } from "react";
import {
  Transaction,
  TransactionFormData,
  TransactionResponse,
} from "../types";
import { api } from "../api";
import { toast, Toaster } from "react-hot-toast";
import { Plus } from "lucide-react";

export function TransactionDashboard() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    Transaction | undefined
  >();

  const fetchTransactions = async (page: number = 1) => {
    try {
      setLoading(true);
      const response: TransactionResponse = await api.getTransactions(page);
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
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      const response = await api.uploadCSV(file);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.message);
      }
    } catch (error: any) {
      console.error("Upload error", error);
      toast.error(error.message || "Failed to upload file");
    }
  };

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      const response = await api.addTransaction(data);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Transaction added successfully");
        fetchTransactions(pagination.currentPage);
      }
      setShowForm(false);
    } catch (error: any) {
      console.error("Add error", error);
      toast.error(error.message || "Failed to add transaction");
    }
  };

  const handleEditTransaction = async (data: TransactionFormData) => {
    if (!selectedTransaction) return;
    try {
      const response = await api.editTransaction(selectedTransaction.id, data);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Transaction edited successfully");
        fetchTransactions(pagination.currentPage);
      }
      setShowForm(false);
      setSelectedTransaction(undefined);
    } catch (error: any) {
      console.error("Edit error", error);
      toast.error(error.message || "Failed to update transaction");
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      const response = await api.deleteTransaction(id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Transaction deleted successfully");
        fetchTransactions(pagination.currentPage);
      }
    } catch (error: any) {
      console.error("Delete error", error);
      toast.error(error.message || "Failed to delete transaction");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">CSVSync</h1>
            <div className="flex space-x-4">
              <button 
              onClick ={() => {
                setSelectedTransaction(undefined);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center  items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ):(
            <>
            <div className="bg-white shadow rounded-lg">
              <p>Transaction List comes here</p>
              <p>Pagination comes here</p>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
