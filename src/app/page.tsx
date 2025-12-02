"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import SummaryCards from "@/components/SummaryCard";
import FilterSection from "@/components/FilterSection";
import TransactionTable from "@/components/TransactionTable";
import ChartVisualization from "@/components/ChartVisualization";
import AddTransactionForm from "@/components/AddTransactionForm";
import {
  setTransactions,
  setLoading,
} from "@/redux/features/transactions/transactionsSlice";
import transactionsData from "@/data/TrackerTransaction.json";
import LineChartVisualization from "@/components/LineChartVisualization";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      dispatch(setLoading(true));
      await new Promise((resolve) => setTimeout(resolve, 1500));
      dispatch(
        setTransactions(
          transactionsData.map((t) => ({
            ...t,
            type: t.type as "income" | "expense",
          }))
        )
      );
    };

    loadData();
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Manage and visualize your transactions
            </p>
          </div>
          <AddTransactionForm />
        </div>

        <SummaryCards />
        <FilterSection />

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <ChartVisualization defaultChartType="bar" />
          <div className="lg:col-span-1">
            <LineChartVisualization />
          </div>
        </div>

        <TransactionTable />
      </div>
    </main>
  );
}
