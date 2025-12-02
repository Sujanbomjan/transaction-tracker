import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./features/transactions/transactionsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      transactions: transactionsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
