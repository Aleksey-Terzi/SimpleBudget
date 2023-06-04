import { createSlice } from "@reduxjs/toolkit";
import { PaginationData } from "../../../models/pagination";
import { PaymentFilterModel } from "./paymentFilterModel";
import { PaymentGridItemModel } from "./paymentGridItemModel";

interface PaymentState {
    payments?: PaymentGridItemModel[];
    paginationData?: PaginationData;
    filter?: PaymentFilterModel;
}

const initialState: PaymentState = {
    payments: undefined,
    paginationData: undefined,
    filter: undefined
}

export const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        setPayments: (state, action) => {
            state.payments = action.payload.payments;
            state.paginationData = action.payload.paginationData;
            state.filter = action.payload.filter;
        }
    }
})

export const { setPayments } = paymentSlice.actions;