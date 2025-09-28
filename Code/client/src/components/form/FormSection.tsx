import { ReactNode } from "react";

interface Props {
    className?: string;
    children?: ReactNode;
}

export default function FormSection({ className, children }: Props) {
    return (
        <fieldset className={`rounded-lg bg-white-bg p-6 border border-gray-border ${className ?? ""}`}>
            {children}
        </fieldset>
    );
}