import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Transaction, TransactionFormData } from "../types";

interface Props {
  transaction?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  onClose: () => void;
}

export function TransactionForm({ transaction, onSubmit, onClose }: Props) {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: "",
    description: "",
    amount: "",
    currency: "USD",
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        currency: transaction.currency,
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {transaction ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div className="border border-gray-300 rounded-md p-3">
            <label htmlFor="description"
            className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              id="description"
              placeholder="e.g. Transaction 1"
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Currency and Amount */}
          <div className="flex space-x-4">
            <div className="flex-1 border border-gray-300 rounded-md p-3">
              <label 
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
              id="amount"
                placeholder="e.g. 1000"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex-1 border border-gray-300 rounded-md p-3">
              <label 
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
              id="currency"
                value={formData.currency}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, currency: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="border border-gray-300 rounded-md p-3">
            <label 
            htmlFor="date"
            className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={formData.date.split("-").reverse().join("-")}
              onChange={(e) => {
                const date = e.target.value.split("-").reverse().join("-");
                setFormData((prev) => ({ ...prev, date }));
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {transaction ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
