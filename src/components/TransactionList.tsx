import { format } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";
import { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
              Description
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
              Currency
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {format(
                  new Date(transaction.date.split("-").reverse().join("-")),
                  "dd MMM yyyy"
                )}
              </td>
              <td
                className="px-6 py-4 text-sm text-gray-800 truncate max-w-xs"
                title={transaction.description}
              >
                {transaction.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
                {parseFloat(transaction.amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: transaction.currency || "USD",
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 uppercase">
                {transaction.currency}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-indigo-200 hover:text-indigo-600 inline-flex items-center transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-200 hover:text-red-600 inline-flex items-center transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
