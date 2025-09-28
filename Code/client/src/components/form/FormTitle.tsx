import { ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

export default function FormTitle({ children }: Props) {
    return (
        <div className="text-base font-semibold text-title-text mb-3">
            {children}
        </div>
    );
}