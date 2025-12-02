"use client";

import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  selectChartData,
  selectFilters,
  selectIsLoading,
} from "@/redux/features/transactions/transactionsSlice";

const INCOME_COLOR = "#10b981";
const EXPENSE_COLOR = "#ef4444";
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B9D",
  "#C471ED",
  "#12CBC4",
];

interface ChartVisualizationProps {
  defaultChartType?: "bar" | "pie";
}

export default function ChartVisualization({
  defaultChartType = "pie",
}: ChartVisualizationProps) {
  const chartData = useSelector(selectChartData);
  const isLoading = useSelector(selectIsLoading);
  const filters = useSelector(selectFilters);
  const [chartType, setChartType] = useState<"bar" | "pie">(defaultChartType);

  const pieChartData = chartData.flatMap((item) => {
    const data = [];
    if (filters.type === "all" || filters.type === "income") {
      if (item.income > 0) {
        data.push({
          name: `${item.category} (Income)`,
          value: item.income,
          type: "income",
          category: item.category,
        });
      }
    }
    if (filters.type === "all" || filters.type === "expense") {
      if (item.expense > 0) {
        data.push({
          name: `${item.category} (Expense)`,
          value: item.expense,
          type: "expense",
          category: item.category,
        });
      }
    }
    return data;
  });

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

  if (chartData.length === 0 || pieChartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
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
          <CardTitle>Transactions by Category</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              className="cursor-pointer"
              onClick={() => setChartType("bar")}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Bar
            </Button>
            <Button
              variant={chartType === "pie" ? "default" : "outline"}
              size="sm"
              className="cursor-pointer"
              onClick={() => setChartType("pie")}
            >
              <PieChartIcon className="h-4 w-4 mr-1" />
              Pie
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartType === "bar" ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  `$${value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
              />
              <Legend />
              {(filters.type === "all" || filters.type === "income") && (
                <Bar dataKey="income" fill={INCOME_COLOR} name="Income" />
              )}
              {(filters.type === "all" || filters.type === "expense") && (
                <Bar dataKey="expense" fill={EXPENSE_COLOR} name="Expense" />
              )}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.type === "income"
                            ? INCOME_COLOR
                            : entry.type === "expense"
                            ? EXPENSE_COLOR
                            : COLORS[index % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) =>
                      `${value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-1">
              <div className="h-full overflow-y-auto max-h-[350px] pr-2">
                <div className="space-y-3">
                  {pieChartData.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className="w-4 h-4 rounded-sm shrink-0"
                        style={{
                          backgroundColor:
                            entry.type === "income"
                              ? INCOME_COLOR
                              : entry.type === "expense"
                              ? EXPENSE_COLOR
                              : COLORS[index % COLORS.length],
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {entry.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          $
                          {entry.value.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
