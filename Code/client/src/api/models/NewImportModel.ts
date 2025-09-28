import { NewImportPaymentModel } from "./NewImportPaymentModel";

export interface NewImportModel {
    wallet: string;
    payments: NewImportPaymentModel[];
}