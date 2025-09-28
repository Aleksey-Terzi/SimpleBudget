import { ReactNode } from "react";
import { IconType } from "../Icon";

export interface TabProps {
    tabKey: string;
    icon?: IconType;
    title: string;
    className?: string;
    children?: ReactNode;
}

export default function Tab({ children }: TabProps) {
    return (
        <>
            {children}
        </>
    );
}