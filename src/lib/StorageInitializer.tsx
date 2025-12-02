"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTransactions } from "@/redux/features/transactions/transactionsSlice";
import type { AppDispatch } from "@/redux/store";

export default function TransactionsInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return null;
}
