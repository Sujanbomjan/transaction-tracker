"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeFromStorage } from "@/redux/features/transactions/transactionsSlice";

export default function StorageInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeFromStorage());
  }, [dispatch]);

  return null;
}
