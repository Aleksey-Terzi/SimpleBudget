import { XMarkIcon } from "@heroicons/react/16/solid";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type ToastType = "info" | "error";

interface Toast {
    toastId: number;
    text: string;
    toastType: ToastType;
    hideOn: number;
}

interface ContextData {
    showToast: (text: string, toastType: ToastType) => void;
    clearToasts: () => void;
}

const ToastContext = createContext<ContextData>({
    showToast: () => {},
    clearToasts: () => {},
})

interface Props {
    children?: ReactNode;
}

const _toastTypes = {
    info: {
        className: "bg-blue-bg hover:[&_button]:bg-blue-hover",
        delay: 5000,
    },
    error: {
        className: "bg-red-600 hover:[&_button]:bg-red-700",
        delay: 10000
    },
};

export default function ToastProvider({ children }: Props) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [toastWasAdded, setToastWasAdded] = useState(false);
    const [deletedToastId, setDeletedToastId] = useState<number | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const providerValue = useMemo(() => ({
        showToast: (text: string, toastType: ToastType) => {
            setToasts(prev => [{
                toastId: prev.length === 0 ? 1 : prev.reduce((maxId, cur) => maxId < cur.toastId ? cur.toastId : maxId, 0) + 1,
                text,
                toastType,
                hideOn: new Date().getTime() + _toastTypes[toastType].delay,
            }, ...prev]);

            setToastWasAdded(true);

            setTimeout(() => setToastWasAdded(false));
        },
        clearToasts: () => {
            setToasts([]);
        },
    }), []);

    const hideToast = useCallback((toastId: number) => {
        if (deletedToastId !== null || !containerRef.current) {
            return;
        }
        
        const index = toasts.findIndex(x => x.toastId === toastId);

        if (index === 0) {
            document.documentElement.style.removeProperty("--toast-height");
        } else {
            const toastHeight = containerRef.current.children[index - 1].getBoundingClientRect().top -
                containerRef.current.children[index].getBoundingClientRect().top;

            document.documentElement.style.setProperty("--toast-height", `${toastHeight}px`);
        }

        setDeletedToastId(toastId);

        setTimeout(() => {
            setToasts(prev => prev.filter(x => x.toastId !== toastId));
            setDeletedToastId(null);
        }, 500);
    }, [toasts, deletedToastId]);


    useEffect(() => {
        if (toasts.length === 0 || deletedToastId !== null) {
            return;
        }

        const now = new Date().getTime();
        let nextHideToastId: number | null = null;
        let nextDelay: number | null = null;

        for (let i = toasts.length - 1; i >= 0; i--) {
            const toast = toasts[i];
            const currentDelay = toast.hideOn - now;
            if (nextDelay === null || currentDelay < nextDelay) {
                nextHideToastId = toast.toastId;
                nextDelay = currentDelay;
            }
        }

        if (nextHideToastId === null || nextDelay === null) {
            throw new Error("Error");
        }
        
        if (nextDelay <= 0) {
            hideToast(nextHideToastId);
            return;
        }

        const timeoutId = setTimeout(() => hideToast(nextHideToastId), nextDelay);

        return () => clearTimeout(timeoutId);
    }, [toasts, deletedToastId, hideToast]);

    return (
        <ToastContext.Provider value={providerValue}>
            {children}
            <div
                ref={containerRef}
                className="fixed right-0 bottom-0 m-4 flex flex-col gap-4 text-sm"
            >
                {toasts.map(({ toastId, text, toastType }, index) => (
                    <div
                        key={toastId}
                        data-added={toastWasAdded && index === 0 ? true : undefined}
                        data-deleted={toastId === deletedToastId ? true : undefined}
                        data-moved={toastId === deletedToastId && toasts.length > 1 ? true: undefined}
                        className={`
                            py-2 ps-4 pe-2 rounded-md flex items-center justify-between
                            transition-all duration-500
                            data-[added]:opacity-0
                            data-[deleted]:opacity-0
                            data-[moved]:mt-[var(--toast-height)]
                            text-contrast-text
                        ` + _toastTypes[toastType].className}
                    >
                        <span>{text}</span>
                        <button
                            className={"p-2 ms-4 rounded-full"}
                            onClick={() => hideToast(toastId)}
                        >
                            <div className="w-4 h-4">
                                <XMarkIcon />
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
    return useContext(ToastContext);
}
