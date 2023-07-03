import { createSlice } from "@reduxjs/toolkit";
import { PaginationData } from "../../../models/pagination";
import { PaymentFilterModel } from "./paymentFilterModel";
import { PaymentGridItemModel } from "./paymentGridItemModel";

interface PaymentState {
    payments?: PaymentGridItemModel[];
    paginationData?: PaginationData;
    filter?: PaymentFilterModel;
    calcSum?: boolean;
    sum?: number;
    sumFormat?: string;
};

const initialState: PaymentState = {
    sum: undefined
};

export const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        setPayments: (state, action) => {
            state.payments = action.payload.payments;
            state.paginationData = action.payload.paginationData;
            state.filter = action.payload.filter;
        },
        revertCalcSum: state => {
            state.calcSum = !state.calcSum;
        },
        setSum: (state, action) => {
            state.sum = action.payload.sum;
            state.sumFormat = action.payload.sumFormat;
        }
    }
})

export const { setPayments, revertCalcSum, setSum } = paymentSlice.actions;