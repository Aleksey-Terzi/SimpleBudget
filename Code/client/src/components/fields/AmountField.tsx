import { numberHelper } from "@/helpers/numberHelper";

type HighlightType = "income" | "expenses" | "zero" | "income and expenses" | "expenses and zero";

interface Props {
    amount: number | undefined | null;
    format: string | undefined | null;
    highlight?: HighlightType;
    isOldFormat?: boolean;
}

export default function AmountField({ amount, format, highlight, isOldFormat }: Props) {
    if (amount === undefined || amount === null || !format) {
        return null;
    }

    if (isOldFormat) {
        amount = numberHelper.fromServerDecimal(amount);
    }

    let formatted = numberHelper.formatDecimal(amount);
    
    const separatorIndex = format.indexOf("{0");
    if (separatorIndex > 0) {
        formatted = format.substring(0, separatorIndex) + formatted;
    }

    if (amount > 0 && (highlight === "income" || highlight === "income and expenses")) {
        return <span className="text-green-700">{formatted}</span>;
    }

    if (amount < 0 && (highlight === "expenses" || highlight === "income and expenses" || highlight === "expenses and zero")) {
        return <span className="text-red-700">{formatted}</span>;
    }

    if (amount === 0 && (highlight === "zero" || highlight === "expenses and zero")) {
        return <span className="text-gray-300">{formatted}</span>;
    }

    return <span>{formatted}</span>
}