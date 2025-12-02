"use client";

import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo, useState } from "react";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  selectFilteredTransactions,
  selectIsLoading,
  selectFilters,
} from "@/redux/features/transactions/transactionsSlice";

const INCOME_COLOR = "#10b981";
const EXPENSE_COLOR = "#ef4444";

type TimeRange = "monthly" | "yearly";

export default function LineChartVisualization() {
  const transactions = useSelector(selectFilteredTransactions);
  const isLoading = useSelector(selectIsLoading);
  const filters = useSelector(selectFilters);
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");

  const chartData = useMemo(() => {
    const dateGroups: Record<
      string,
      { date: string; income: number; expense: number }
    > = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      let key: string;

      switch (timeRange) {
        case "monthly":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
          break;
        case "yearly":
          key = `${date.getFullYear()}`;
          break;
      }

      if (!dateGroups[key]) {
        dateGroups[key] = { date: key, income: 0, expense: 0 };
      }

      if (transaction.type === "income") {
        dateGroups[key].income += transaction.amount;
      } else {
        dateGroups[key].expense += transaction.amount;
      }
    });

    return Object.values(dateGroups)
      .map((item) => ({
        date: item.date,
        income: Number(item.income.toFixed(2)),
        expense: Number(item.expense.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, timeRange]);

  const formatXAxis = (date: string) => {
    switch (timeRange) {
      case "monthly":
        const [year, month] = date.split("-");
        return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString(
          "en-US",
          { month: "short" }
        )} ${year.slice(2)}`;
      case "yearly":
        return date;
    }
  };

  const formatTooltipLabel = (date: string) => {
    switch (timeRange) {
      case "monthly":
        const [year, month] = date.split("-");
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
          }
        );
      case "yearly":
        return date;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No Transaction data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transaction Trends Over Time</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={timeRange === "monthly" ? "default" : "outline"}
              size="sm"
              className="cursor-pointer"
              onClick={() => setTimeRange("monthly")}
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Monthly
            </Button>
            <Button
              variant={timeRange === "yearly" ? "default" : "outline"}
              size="sm"
              className="cursor-pointer"
              onClick={() => setTimeRange("yearly")}
            >
              <CalendarRange className="h-4 w-4 mr-1" />
              Yearly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={100}
              tickFormatter={formatXAxis}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number) =>
                `$${value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              }
              labelFormatter={formatTooltipLabel}
            />
            <Legend />
            {(filters.type === "all" || filters.type === "income") && (
              <Line
                type="monotone"
                dataKey="income"
                stroke={INCOME_COLOR}
                strokeWidth={2}
                name="Income"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {(filters.type === "all" || filters.type === "expense") && (
              <Line
                type="monotone"
                dataKey="expense"
                stroke={EXPENSE_COLOR}
                strokeWidth={2}
                name="Expense"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
