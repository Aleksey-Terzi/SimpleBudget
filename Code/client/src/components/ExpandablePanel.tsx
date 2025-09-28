import { ReactNode, useRef, useState } from "react";
import Icon from "./Icon";

interface Props {
    title?: ReactNode;
    defaultExpanded?: boolean;
    children?: ReactNode;
    onChange?: (expanded: boolean) => void;
}

function setContentHeight(content: HTMLDivElement | null, expanded: boolean) {
    if (!content || content.scrollHeight === 0) {
        return;
    }
    const height = expanded ? content.scrollHeight : 0;
    content.style.height = `${height}px`;
}

export default function ExpandablePanel({ title, defaultExpanded, children, onChange }: Props) {
    const [expanded, setExpanded] = useState(defaultExpanded === true);

    const contentRef = useRef<HTMLDivElement>(null);

    function handleButtonClick() {
        if (expanded) {
            setContentHeight(contentRef.current, true);
        }

        setExpanded(!expanded);
        setContentHeight(contentRef.current, !expanded);

        if (contentRef.current) {
            contentRef.current.style.overflowY = "clip";
        }

        setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.style.height = "";
                contentRef.current.style.overflowY = "";
            }
            onChange?.(!expanded)
        }, 300);
    }

    return (
        <div
            data-expanded={expanded ? true : undefined}
            className="group border border-gray-border rounded-lg flex flex-col"
        >
            <button type="button"
                tabIndex={-1}
                className="
                    flex justify-between items-center px-3 py-2
                "
                onClick={handleButtonClick}
            >
                <div>
                    {title}
                </div>
                <Icon icon="chevron-left" className="
                    size-4
                    transition-[transform] duration-200 ease-in
                    group-data-[expanded]:-rotate-90
                " />
            </button>
            <div className="
                border-t border-gray-border
                px-3 py-0
                transition-[padding,visibility] duration-200 ease-in
                collapse
                group-data-[expanded]:py-2
                group-data-[expanded]:visible
            ">
                <div ref={contentRef} className="
                    h-0
                    transition-[height] duration-200 ease-in
                    group-data-[expanded]:h-auto
                ">
                    {children}
                </div>
            </div>
        </div>
    );
}