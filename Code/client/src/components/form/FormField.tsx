import { ReactNode } from "react";

interface Props {
    className?: string;
    label?: ReactNode;
    description?: ReactNode;
    required?: boolean;
    children?: ReactNode;
}

export default function FormField({ label, className, description, required, children }: Props) {
    return (
        <div className={`flex flex-col gap-1 mb-3 ` + (className ?? "")}>
            {label && (
                <label className="font-semibold text-title-text w-fit">
                    {label}
                    {required === true && <span className="ms-1 font-normal text-red-invalid">*</span>}
                </label>
            )}
            <div className="field-content">
                {children}
            </div>
            {description && (
                <span className="text-xs text-description-text">
                    {description}
                </span>
            )}
        </div>
    );
}
