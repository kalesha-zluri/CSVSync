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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="relative bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
          {transaction ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Description */}
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
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
              className="block w-full h-10 sm:h-12 px-4 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Currency and Amount */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1 sm:space-y-2">
              <label
                htmlFor="amount"
                className="block text-sm font-semibold text-gray-700"
              >
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
                className="block w-full h-10 sm:h-12 px-4 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex-1 space-y-1 sm:space-y-2">
              <label
                htmlFor="currency"
                className="block text-sm font-semibold text-gray-700"
              >
                Currency
              </label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, currency: e.target.value }))
                }
                className="block w-full h-10 sm:h-12 px-4 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="date"
              className="block text-sm font-semibold text-gray-700"
            >
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
              className="block w-full h-10 sm:h-12 px-4 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 sm:px-6 sm:py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              {transaction ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
