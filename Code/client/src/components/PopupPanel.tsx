import { ForwardedRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";

interface Props {
    ref?: ForwardedRef<HTMLDivElement>;
    relative: HTMLElement;
    trigger?: HTMLElement | null;
    className?: string;
    maxHeight?: number;
    children?: ReactNode;
    onOpen?: () => void;
    onClose?: (escPressed: boolean) => void;
}

export default function PopupPanel({
    ref,
    relative,
    trigger,
    className,
    maxHeight,
    children,
    onOpen,
    onClose
}: Props) {
    const [isInitialized, setIsInitialized] = useState(false);

    const panelRef = useRef<HTMLDivElement>(null);
    useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => panelRef.current);

    useEffect(() => {
        const { height, top, width } = relative.getBoundingClientRect();
        const style = window.getComputedStyle(relative);

        let panelTop: number | null = null;
        let panelBottom: number | null = null;

        if (top > window.innerHeight - top) {
            panelBottom = height + parseFloat(style.marginBottom);
        } else {
            panelTop = height + parseFloat(style.marginTop);
        }

        document.documentElement.style.setProperty("--popup-panel-relative-width",`${width}px`);
        document.documentElement.style.setProperty("--popup-panel-max-height", maxHeight ? `${maxHeight}px` : null);
        document.documentElement.style.setProperty("--popup-panel-top", panelTop !== null ? `${panelTop}px` : null);
        document.documentElement.style.setProperty("--popup-panel-bottom", panelBottom !== null ? `${panelBottom}px` : null);

        setIsInitialized(true);

        setTimeout(() => {
            onOpen?.();

            if (panelRef.current) {
                panelRef.current.dataset.visible = "true";
            }
        });
    }, [onOpen, relative, maxHeight]);

    useEffect(() => {
        if (!onClose) {
            return;
        }

        document.body.addEventListener("focusin", handleFocusIn);
        document.body.addEventListener("click", handleClick);
        document.body.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.removeEventListener("click", handleClick);
            document.body.removeEventListener("focusin", handleFocusIn);
            document.body.removeEventListener("keydown", handleKeyDown);
        };

        function handleClick(e: MouseEvent) {
            if (e.target !== null
                && e.target !== trigger
                && (!trigger || !trigger.contains(e.target as Node))
                && (panelRef.current && !panelRef.current.contains(e.target as Node))
            ) {
                onClose!(false);
            }
        }

        function handleFocusIn(e: FocusEvent) {
            if (e.target !== null
                && e.target !== trigger
                && (panelRef.current && !panelRef.current.contains(e.target as Node))
            ) {
                onClose!(false);
            }
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key == "Escape") {
                onClose!(true);
            }
        }
    }, [onClose, trigger]);

    if (!isInitialized) {
        return null;
    }

    return (
        <div
            ref={panelRef}
            className={`
                absolute left-0 top-[var(--popup-panel-top)] bottom-[var(--popup-panel-bottom)]
                rounded-lg border border-gray-border
                p-1 mt-0.5 mb-0.5
                z-10
                bg-white-bg text-main-text
                opacity-0
                data-[visible]:opacity-100
                transition-all ease-in-out
                ` + (className ?? "")
            }
        >
            {children}
            <div className="w-0 h-0 p-0 m-0">
                <button
                    autoFocus={!!onClose}
                    className="outline-none"
                    tabIndex={-1}
                />
            </div>
        </div>
    );
}