import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { paymentSlice } from "../routes/payments/models/paymentSlice";
import { planPaymentSlice } from "../routes/plans/models/planPaymentSlice";

export const store = configureStore({
    reducer: {
        payment: paymentSlice.reducer,
        planPayment: planPaymentSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;