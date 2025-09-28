import { useEffect, useState } from "react";
import Button from "../Button";

interface Props {
    isLoading?: boolean;
    onClear?: () => void;
}

export default function SearchCriteriaButtons({ isLoading, onClear }: Props) {
    const [buttonClicked, setButtonClicked] = useState<"search" | "clear" | null>(null);

    useEffect(() => {
        if (!isLoading) {
            setButtonClicked(null);
        }
    }, [isLoading]);

    return (
        <div className="flex gap-1 mt-5">
            <Button
                variant="search"
                disabled={isLoading === true && buttonClicked !== "search"}
                isLoading={isLoading === true && buttonClicked === "search"}
                onClick={() => setButtonClicked("search")}
            />
            <Button
                variant="clear"
                disabled={isLoading === true && buttonClicked !== "clear"}
                isLoading={isLoading === true && buttonClicked === "clear"}
                onClick={() => {
                    setButtonClicked("clear");
                    onClear?.();
                }}
            />
        </div>
    );
}