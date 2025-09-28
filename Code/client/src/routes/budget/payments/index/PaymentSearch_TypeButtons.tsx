import { useEffect, useState } from "react";
import ButtonGroup from "@/components/ButtonGroup";
import { useSearch } from "@/components/search/Search";
import { PaymentCriteria } from "./PaymentCriteria";

export default function PaymentSearch_TypeButtons() {
    const { criteria, isLoading, setCriteria } = useSearch<PaymentCriteria, object>();
    const [buttonClicked, setButtonClicked] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading) {
            setButtonClicked(null);
        }
    }, [isLoading])

    function handleClick(key: "expenses" | "income" | "transfer") {
        setCriteria({
            ...criteria,
            id: null,
            type: criteria.type !== key ? key : null,
        });
        setButtonClicked(key);
    }

    return (
        <ButtonGroup
            selectedKey={criteria?.type}
            disabled={isLoading}
            onClick={key => handleClick(key as "expenses" | "income" | "transfer")}
        >
            {[
                { key: "expenses", icon: "shopping-cart", text: "Expenses", isLoading: buttonClicked === "expenses" },
                { key: "income", icon: "banknotes", text: "Income", isLoading: buttonClicked === "income" },
                { key: "transfer", icon: "reset", text: "Transfer", isLoading: buttonClicked === "transfer" },
            ]}
        </ButtonGroup>
    )
}