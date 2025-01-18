import { useEffect, useState } from "react";
import { Transaction, TransactionResponse } from "../types";
import { api } from "../api";
import toast from "react-hot-toast";

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

  return <> </>;
}
