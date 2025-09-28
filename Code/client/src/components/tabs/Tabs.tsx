import { Children, isValidElement, ReactElement, ReactNode, useMemo, useState } from "react";
import { TabProps } from "./Tab";
import Icon from "../Icon";

interface Props {
    defaultSelectedTabKey?: string;
    selectedTabKey?: string;
    className?: string;
    children?: ReactElement<TabProps> | ReactElement<TabProps>[];
    onSelect?: (tabKey: string) => void;
}

export default function Tabs({ defaultSelectedTabKey, selectedTabKey, className, children, onSelect }: Props) {
    const [internalSelectedTabKey, setInternalSelectedTabKey] = useState<string | null>(defaultSelectedTabKey ?? null);

    const finalSelectedTabKey = selectedTabKey ?? internalSelectedTabKey;

    const { tabButtons, tabContents } = useMemo(() => {
        function handleTabClick(tabKey: string) {
            if (tabKey === finalSelectedTabKey) {
                return;
            }
            setInternalSelectedTabKey(tabKey);
            onSelect?.(tabKey);
        }

        if (!children) {
            return { tabButtons: [], tabContents: [] };
        }

        const tabButtons: ReactNode[] = [];
        const tabContents: ReactNode[] = [];

        Children.forEach(children, (element, index) => {
            if (!isValidElement(element)) {
                return;
            }
            const { tabKey, title, icon, className } = element.props;
            if (!tabKey || !title) {
                return;
            }
            tabButtons.push(
                <li key={tabKey}>
                    <button
                        type="button"
                        tabIndex={-1}
                        data-selected={!finalSelectedTabKey && index === 0 || tabKey === finalSelectedTabKey ? true : undefined}
                        onClick={() => handleTabClick(tabKey)}
                    >
                        {icon ? (
                            <div className="flex gap-2 items-center">
                                <Icon icon={icon} />
                                {title}
                            </div>
                        ): <>{title}</>}
                    </button>
                </li>
            );
            tabContents.push((
                <div key={tabKey} className={`${(finalSelectedTabKey || index !== 0) && tabKey !== finalSelectedTabKey ? "hidden" : ""} ${className ?? ""}`}>
                    {element}
                </div>
            ));
        });
        
        return { tabButtons, tabContents };
    }, [children, finalSelectedTabKey, onSelect]);

    return (
        <div className={className}>
            <ul className="
                flex
                border-b border-gray-border
                text-main-text

                [&>li>button]:px-4 [&>li>button]:py-2 [&>li>button]:mb-[-1px]
                [&>li>button]:bg-white-bg
                [&>li>button]:border-t [&>li>button]:border-l [&>li>button]:border-r [&>li>button]:rounded-t-lg
                [&>li>button]:border-transparent

                hover:[&>li>button]:border-gray-hover

                data-[selected]:[&>li>button]:border-gray-border
                data-[selected]:[&>li>button]:border-b
                data-[selected]:[&>li>button]:border-b-white-bg
                data-[selected]:[&>li>button]:cursor-default
            ">
                {tabButtons}
            </ul>
            {tabContents}
        </div>
    );
}