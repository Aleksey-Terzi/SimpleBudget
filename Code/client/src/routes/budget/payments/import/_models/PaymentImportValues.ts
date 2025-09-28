import { ComboBoxValue } from "@/components/inputs/combobox/ComboBoxValue";

export interface PaymentImportValues {
    walletName: ComboBoxValue;
    payments: {
        categoryName: ComboBoxValue;
        companyName: ComboBoxValue;
        description: string;
    }[];
}