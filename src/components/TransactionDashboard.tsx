import { useEffect, useState } from "react";
import { Transaction, TransactionFormData, TransactionResponse } from "../types";
import { api } from "../api";
import toast, { Toaster } from "react-hot-toast";
import { set } from "date-fns";

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

  const handleFileUpload = async(file: File) => {
    try{
      const response = await api.uploadCSV(file);
      if(response.error){
        toast.error(response.error);
      } else{
        toast.success(response.message);
      }
    } catch(error: any){
      console.error("Upload error", error);
      toast.error(error.message|| "Failed to upload file");
    }
  };

  const handleAddTransaction = async (data: TransactionFormData) => {
    try{
      const response = await api.addTransaction(data);
      if(response.error){
        toast.error(response.error);
      } else{
        toast.success("Transaction added successfully");
        fetchTransactions(pagination.currentPage);
      }
      setShowForm(false);
    } catch(error: any){
      console.error("Add error", error);
      toast.error(error.message|| "Failed to add transaction");
    }
  }

  const handleEditTransaction = async (data: TransactionFormData) => {
    if(!selectedTransaction) return;
    try{
      const response = await api.editTransaction(selectedTransaction.id, data);
      if(response.error){
        toast.error(response.error);
      } else{
        toast.success("Transaction edited successfully");
        fetchTransactions(pagination.currentPage);
      }
      setShowForm(false);
      setSelectedTransaction(undefined);
    } catch(error: any){
      console.error("Edit error", error);
      toast.error(error.message|| "Failed to update transaction");
    }
  }

  const handleDeleteTransaction = async (id: number)=>{
    if(!window.confirm("Are you sure you want to delete this transaction?")) return;
    try{
      const response = await api.deleteTransaction(id);
      if(response.error){
        toast.error(response.error);
      } else{
        toast.success("Transaction deleted successfully");
        fetchTransactions(pagination.currentPage);
      }
    } catch(error: any){
      console.error("Delete error", error);
      toast.error(error.message|| "Failed to delete transaction");
    }
  }
  return (
  <div className="min-h-screen bg-gray-100">
    <Toaster position="top-right"/>
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    </div>

  </div>
  );
}
