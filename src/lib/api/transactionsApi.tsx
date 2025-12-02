import { Transaction } from "@/redux/features/transactions/transactionsSlice";

const STORAGE_KEY = "transactions_data";
const INITIALIZED_KEY = "transactions_initialized";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class TransactionsAPI {
  static async fetchTransactions(): Promise<Transaction[]> {
    await delay(800);

    try {
      const hasInitialized = localStorage.getItem(INITIALIZED_KEY);
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (hasInitialized && storedData) {
        return JSON.parse(storedData);
      }
      const response = await fetch("/data/TrackerTransaction.json");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(INITIALIZED_KEY, "true");

      return data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }

      return [];
    }
  }

  static async addTransaction(transaction: Transaction): Promise<Transaction> {
    await delay(500);

    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      const transactions: Transaction[] = storedData
        ? JSON.parse(storedData)
        : [];

      transactions.unshift(transaction);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

      return transaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  }

  static async deleteTransaction(id: number): Promise<void> {
    await delay(500);

    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) return;

      const transactions: Transaction[] = JSON.parse(storedData);
      const filtered = transactions.filter((t) => t.id !== id);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }

  static async resetToAPIData(): Promise<Transaction[]> {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(INITIALIZED_KEY);

      return await this.fetchTransactions();
    } catch (error) {
      console.error("Error resetting data:", error);
      throw error;
    }
  }
}
