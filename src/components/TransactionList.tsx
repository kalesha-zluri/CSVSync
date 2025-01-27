import { format } from "date-fns";
import { Edit2 } from "lucide-react";
import { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  selectedIds: number[];
  onSelect: (id: number) => void;
  onSelectAll: (ids: number[]) => void;
}

export function TransactionList({
  transactions,
  onEdit,
  selectedIds,
  onSelect,
  onSelectAll,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
              <input
                data-testid="select-all-checkbox"
                type="checkbox"
                checked={selectedIds.length === transactions.length}
                onChange={(e) =>
                  onSelectAll(
                    e.target.checked ? transactions.map((t) => t.id) : []
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-indigo-600"
              />
            </th>
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
              Amount(INR)
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          data-testid="transaction-tbody"
          className="divide-y divide-gray-200"
        >
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="hover:bg-gray-100 transition-colors duration-150 ease-in-out"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(transaction.id)}
                  onChange={() => onSelect(transaction.id)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                />
              </td>
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
                {parseFloat(transaction.amount)
                  .toLocaleString("en-US", {
                    style: "currency",
                    currency: transaction.currency,
                    minimumFractionDigits: 2,
                  })
                  .replace(/^(\D+)/, "$1 ")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 uppercase">
                {transaction.amountInr
                  .toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                  .replace(/^(\D+)/, "$1 ")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center">
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-indigo-200 hover:text-indigo-600 inline-flex items-center transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}