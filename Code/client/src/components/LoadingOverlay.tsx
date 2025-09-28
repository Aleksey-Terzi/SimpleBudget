import { ReactNode } from "react";
import Spinner from "./Spinner";

interface Props {
    isLoading?: boolean;
    children?: ReactNode;
}

export default function LoadingOverlay({ isLoading, children }: Props) {
    return (
        <div className="relative">
            <div
                data-visible={isLoading === true ? true : undefined}
                className="
                    absolute left-0 top-0
                    w-full h-full
                    flex justify-center items-center
                    bg-white-bg/60
                    transition-all ease-in-out
                    -z-50 opacity-0 data-[visible]:z-50 data-[visible]:opacity-100
                "
            >
                <div className="bg-white-bg rounded-full w-7 h-7 me-2">
                    <Spinner className="stroke-blue-bg fill-blue-bg" />
                </div>
            </div>

            {children}
        </div>
    );
}
