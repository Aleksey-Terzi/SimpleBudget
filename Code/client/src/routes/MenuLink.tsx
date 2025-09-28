import Icon, { IconType } from "@/components/Icon";
import { Link, useParams } from "react-router";
import { formRouteHelper } from "./formRouteHelper";

interface Props {
    url?: string;
    text: string;
    icon: IconType;
    onClick?: () => unknown;
}

export default function MenuLink({ url, text, icon, onClick }: Props) {
    const params = useParams();

    if (onClick) {
        return (
            <button
                className="
                    flex items-center gap-2
                    px-3 py-1
                    rounded-full
                    hover:bg-gray-hover
                "
                type="button"
                onClick={onClick}
            >
                <Icon icon={icon} />
                {text}
            </button>
        );
    }

    if (!url) {
        throw new Error("Either url or onClick shoudl be specified");
    }

    return (
        <Link to={formRouteHelper.setUrlParams(url, params)} className="
            flex items-center gap-2
            px-3 py-1
            rounded-full
            hover:bg-gray-hover
        ">
            <Icon icon={icon} />
            {text}
        </Link>
    );
}
