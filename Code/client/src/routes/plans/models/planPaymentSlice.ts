import { createSlice } from "@reduxjs/toolkit";
import { PaginationData } from "../../../models/pagination";
import { PlanPaymentFilterModel } from "./planPaymentFilterModel";
import { PlanPaymentGridItemModel } from "./planPaymentGridItemModel";

interface PlanPaymentState {
    planPayments?: PlanPaymentGridItemModel[];
    paginationData?: PaginationData;
    filter?: PlanPaymentFilterModel;
}

const initialState: PlanPaymentState = {
    planPayments: undefined,
    paginationData: undefined,
    filter: undefined
}

export const planPaymentSlice = createSlice({
    name: "planPayment",
    initialState,
    reducers: {
        setPlanPayments: (state, action) => {
            state.planPayments = action.payload.planPayments;
            state.paginationData = action.payload.paginationData;
            state.filter = action.payload.filter;
        }
    }
})

export const { setPlanPayments } = planPaymentSlice.actions;