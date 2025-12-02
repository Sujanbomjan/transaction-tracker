"use client";

import { useSelector } from "react-redux";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  selectSummary,
  selectIsLoading,
} from "@/redux/features/transactions/transactionsSlice";

export default function SummaryCards() {
  const { totalIncome, totalExpenses, balance } = useSelector(selectSummary);
  const isLoading = useSelector(selectIsLoading);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card className="relative overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-50/50 rounded-full -ml-12 -mb-12" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-slate-600 text-sm font-medium">Total Income</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(totalIncome)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-slate-600 text-sm font-medium">Total Expenses</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
        <div
          className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}
        />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`${
                balance >= 0 ? "bg-blue-100" : "bg-red-100"
              } p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
            >
              <Wallet
                className={`h-6 w-6 ${
                  balance >= 0 ? "text-blue-600" : "text-red-600"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-slate-600 text-sm font-medium">
              Current Balance
            </p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(Math.abs(balance))}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
