import { Link } from "react-router";
import Icon, { IconType } from "./Icon";

interface Props {
    url?: string;
    icon: IconType;
    title?: string;
    onClick?: () => void;
}

export default function IconButton({ url, icon, title, onClick }: Props) {
    if (url) {
        return (
            <Link
                to={url}
                className="block w-fit p-0.5 rounded-full hover:text-blue-hover"
                title={title}
                tabIndex={-1}
            >
                <Icon icon={icon} className="size-5" />
            </Link>
        );
    }

    return (
        <button
            type="button"
            className="block w-fit p-0.5 rounded-full hover:text-blue-hover"
            title={title}
            tabIndex={-1}
            onClick={onClick}
        >
            <Icon icon={icon} className="size-5" />
        </button>
    );
}