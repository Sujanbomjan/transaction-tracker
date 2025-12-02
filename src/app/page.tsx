"use client";

import { useEffect } from "react";
import { fetchTransactions } from "@/redux/features/transactions/transactionsSlice";

import SummaryCards from "@/components/SummaryCard";
import FilterSection from "@/components/FilterSection";
import TransactionTable from "@/components/TransactionTable";
import ChartVisualization from "@/components/ChartVisualization";
import AddTransactionForm from "@/components/AddTransactionForm";
import LineChartVisualization from "@/components/LineChartVisualization";
import { useAppDispatch } from "@/redux/hooks";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
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
