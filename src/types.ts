export interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: string;
    currency: string;
    amountInr: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TransactionResponse{
    transactions: Transaction[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

export interface TransactionFormData{
    date: string;
    description: string;
    amount: string;
    currency: string;
}

export interface ErrorData {
  row: string;
  transaction_data: TransactionFormData[];
  reason: string;
}

export interface ErrorResponse {
    error: string;
    data: ErrorData[];
}