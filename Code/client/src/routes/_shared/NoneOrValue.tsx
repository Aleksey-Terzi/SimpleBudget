import { ReactNode } from "react";

interface Props {
    s: ReactNode | undefined | null;
}

export default function NoneOrValue({ s }: Props) {
    return s ? s : <i>None</i>;
}