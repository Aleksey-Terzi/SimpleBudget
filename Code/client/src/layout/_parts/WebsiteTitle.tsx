import { Link } from "react-router";
import Icon from "@/components/Icon";
import { HOME_URL } from "@/helpers/settings";

export default function WebsiteTitle() {
    return (
        <Link className="flex gap-3 items-center hover:text-blue-hover" to={HOME_URL}>
            <Icon icon="dollar" variant="outline" className="size-6" />
            <div className="text-base">
                Simple Budget
            </div>
        </Link>
    )
}