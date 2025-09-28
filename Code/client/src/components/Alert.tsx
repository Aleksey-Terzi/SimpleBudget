import { ReactNode } from "react";

export type AlertType = "error" | "warning" | "info";

const _alertTypes = {
    error: "bg-red-100 text-red-900 border-red-200",
    warning: "bg-amber-100 text-amber-900 border-amber-200",
    info: "border-blue-200 bg-blue-100 text-blue-900",
}

interface Props {
    type?: AlertType;
    className?: string;
    children?: ReactNode;
}

export default function Alert({ type, className, children }: Props) {
    return (
        <div className={`w-full p-4 rounded-lg border ${_alertTypes[type ?? "error"]} ${className ?? ""}`}>
            {children}
        </div>
    );
}