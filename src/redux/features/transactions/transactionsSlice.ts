import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  filters: {
    categories: string[];
    type: string;
  };
}

const loadFromStorage = (): Transaction[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("transactions");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading transactions from storage:", error);
    return [];
  }
};

const saveToStorage = (transactions: Transaction[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions to storage:", error);
  }
};

const initialState: TransactionsState = {
  transactions: [],
  isLoading: true,
  filters: {
    categories: [],
    type: "all",
  },
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    initializeFromStorage: (state) => {
      const storedTransactions = loadFromStorage();
      if (storedTransactions.length > 0) {
        state.transactions = storedTransactions;
      }
      state.isLoading = false;
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      const storedTransactions = loadFromStorage();
      if (storedTransactions.length === 0) {
        state.transactions = action.payload;
        saveToStorage(action.payload);
      } else {
        state.transactions = storedTransactions;
      }
      state.isLoading = false;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      saveToStorage(state.transactions);
    },
    deleteTransaction: (state, action: PayloadAction<number>) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
      saveToStorage(state.transactions);
    },
    setFilters: (
      state,
      action: PayloadAction<{ categories?: string[]; type?: string }>
    ) => {
      if (action.payload.categories !== undefined) {
        state.filters.categories = action.payload.categories;
      }
      if (action.payload.type !== undefined) {
        state.filters.type = action.payload.type;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearAllTransactions: (state) => {
      state.transactions = [];
      saveToStorage([]);
    },
  },
});

export const {
  initializeFromStorage,
  setTransactions,
  addTransaction,
  deleteTransaction,
  setFilters,
  setLoading,
  clearAllTransactions,
} = transactionsSlice.actions;

export const selectTransactions = (state: RootState) =>
  state.transactions.transactions;

export const selectFilters = (state: RootState) => state.transactions.filters;

export const selectIsLoading = (state: RootState) =>
  state.transactions.isLoading;

export const selectFilteredTransactions = createSelector(
  [selectTransactions, selectFilters],
  (transactions, filters) => {
    return transactions.filter((transaction) => {
      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(transaction.category);
      const typeMatch =
        filters.type === "all" || transaction.type === filters.type;
      return categoryMatch && typeMatch;
    });
  }
);

export const selectCategories = createSelector(
  [selectTransactions],
  (transactions) => {
    const categories = new Set(transactions.map((t) => t.category));
    return Array.from(categories).sort();
  }
);

export const selectSummary = createSelector(
  [selectFilteredTransactions],
  (filtered) => {
    const totalIncome = filtered
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filtered
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance };
  }
);

export const selectChartData = createSelector(
  [selectFilteredTransactions],
  (filtered) => {
    const categoryTotals = filtered.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = { income: 0, expense: 0 };
      }
      if (transaction.type === "income") {
        acc[transaction.category].income += transaction.amount;
      } else {
        acc[transaction.category].expense += transaction.amount;
      }
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    return Object.entries(categoryTotals)
      .map(([category, amounts]) => ({
        category,
        income: Number(amounts.income.toFixed(2)),
        expense: Number(amounts.expense.toFixed(2)),
        total: Number((amounts.income + amounts.expense).toFixed(2)),
      }))
      .sort((a, b) => b.total - a.total);
  }
);

export default transactionsSlice.reducer;
