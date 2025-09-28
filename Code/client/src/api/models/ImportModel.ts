import { SuggestedPaymentModel } from "./SuggestedPaymentModel";

export interface ImportModel {
    valueFormat: string;
    payments: SuggestedPaymentModel[];
    error: string | undefined | null;
}