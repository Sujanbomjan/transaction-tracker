"use client";

import { useSelector } from "react-redux";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Income",
      amount: totalIncome,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Expenses",
      amount: totalExpenses,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Current Balance",
      amount: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-blue-600" : "text-red-600",
      bgColor: balance >= 0 ? "bg-blue-50" : "bg-red-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {formatCurrency(card.amount)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {index === 2 && balance >= 0 && "+"}
                {index === 2 && formatCurrency(Math.abs(balance))}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
