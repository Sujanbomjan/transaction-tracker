"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { Trash2, Loader2, Receipt, Search } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  selectFilteredTransactions,
  selectIsLoading,
  deleteTransaction,
} from "@/redux/features/transactions/transactionsSlice";

const ITEMS_PER_PAGE = 10;

export default function TransactionTable() {
  const transactions = useSelector(selectFilteredTransactions);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedTransactions = useMemo(() => {
    return transactions.slice(startIndex, endIndex);
  }, [transactions, startIndex, endIndex]);

  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(
      2,
      "0"
    )}, ${date.getFullYear()}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleDelete = async (id: number, description: string) => {
    setDeletingId(id);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(deleteTransaction(id));

      toast.success("Transaction deleted", {
        description: `"${description}" has been removed.`,
      });
      if (paginatedTransactions.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error("Failed to delete transaction", {
        description: "Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (isLoading) {
    return (
      <Card className="border shadow-lg">
        <CardHeader className="border-b bg-white">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-lg overflow-hidden">
      <CardHeader className="border-b bg-white py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <Receipt className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              Transaction History
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-xs bg-blue-100 text-blue-700 border-blue-200"
            >
              {transactions.length}{" "}
              {transactions.length === 1 ? "record" : "records"}
            </Badge>
            {totalPages > 1 && (
              <Badge variant="outline" className="text-xs border-slate-300">
                Page {currentPage} of {totalPages}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-hidden">
          <div className="max-h-[700px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10 border-b border-slate-200">
                <TableRow className="hover:bg-white">
                  <TableHead className="w-[250px] font-semibold text-slate-700 h-10">
                    Description
                  </TableHead>
                  <TableHead className="w-[120px] font-semibold text-slate-700 h-10">
                    Amount
                  </TableHead>
                  <TableHead className="w-[100px] font-semibold text-slate-700 h-10">
                    Type
                  </TableHead>
                  <TableHead className="w-[120px] font-semibold text-slate-700 h-10">
                    Category
                  </TableHead>
                  <TableHead className="w-[120px] font-semibold text-slate-700 h-10">
                    Date
                  </TableHead>
                  <TableHead className="text-right w-20 font-semibold text-slate-700 h-10">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground h-64"
                    >
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="bg-slate-100 p-6 rounded-full">
                          <Search className="h-12 w-12 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-700">
                            No transactions found
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            Try adjusting your filters or add a new transaction
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction, index) => (
                    <TableRow
                      key={transaction.id}
                      className={`${
                        deletingId === transaction.id ? "opacity-50" : ""
                      } hover:bg-slate-50 transition-colors border-b border-slate-100`}
                    >
                      <TableCell className="font-medium text-slate-900 py-3">
                        {transaction.description}
                      </TableCell>
                      <TableCell
                        className={`font-bold py-3 ${
                          transaction.type === "income"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          className={`capitalize font-medium text-xs ${
                            transaction.type === "income"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200"
                              : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                          }`}
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="inline-flex items-center rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
                          {transaction.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium py-3">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={deletingId === transaction.id}
                              className="hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer hover:scale-110"
                            >
                              {deletingId === transaction.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-2">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl">
                                Are you sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base">
                                This action cannot be undone. This will
                                permanently delete the transaction
                                <br />
                                <br />
                                <strong className="text-slate-900">
                                  "{transaction.description}"
                                </strong>
                                <br />
                                Amount:{" "}
                                <strong className="text-slate-900">
                                  {formatCurrency(transaction.amount)}
                                </strong>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(
                                    transaction.id,
                                    transaction.description
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700 cursor-pointer"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {totalPages > 1 && transactions.length > 0 && (
          <div className="border-t bg-white px-6 py-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className={`cursor-pointer ${
                          currentPage === page
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
