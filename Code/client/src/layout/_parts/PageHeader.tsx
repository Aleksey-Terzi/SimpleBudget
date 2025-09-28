import { Fragment, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router";
import Icon from "@/components/Icon";
import { formRouteHelper } from "@/routes/formRouteHelper";
import MenuLink from "@/routes/MenuLink";
import { useMenuProvider } from "@/contexts/MenuProvider";

export default function PageHeader() {
    const location = useLocation();
    const params = useParams();
    const { menus: dynamicMenus } = useMenuProvider();

    const { breadcrumbs, menus } = useMemo(() => {
        const breadcrumbs = formRouteHelper.getBreadcrumbs(location.pathname);
        const staticMenus = breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].menu : null;
        const menus = staticMenus ? [...staticMenus, ...dynamicMenus] : dynamicMenus;
        return { breadcrumbs, menus };
    }, [location.pathname, dynamicMenus]);

    return (
        <div className="flex gap-12">
            <ol className="flex items-center gap-2">
                <li>
                    {location.pathname === "/" ? <>Home</> : (
                        <Link
                            to="/"
                            className="hover:text-blue-hover"
                        >
                            Home
                        </Link>
                    )}
                </li>
                {breadcrumbs?.map(({ title, category, path }, index) => (
                    <Fragment key={path}>
                        {category && (
                            <li className="flex items-center gap-2">
                                <Icon icon="chevron-right" />
                                {category}
                            </li>
                        )}
                        <li className="flex items-center gap-2">
                            <Icon icon="chevron-right" />
                            {index === breadcrumbs.length - 1 ? title : (
                                <Link
                                    to={formRouteHelper.setUrlParams(path, params)}
                                    className="hover:text-blue-hover"
                                >
                                    {title}
                                </Link>
                            )}
                        </li>
                    </Fragment>
                ))}
            </ol>
            {menus && (
                menus.length === 1 ? (
                    <MenuLink url={menus[0].url} text={menus[0].text} icon={menus[0].icon} onClick={menus[0].onClick} />
                ) : (
                    <div className="flex">
                        {menus.map(({ url, text, icon, onClick }) => (
                            <MenuLink key={url} url={url} text={text} icon={icon} onClick={onClick} />
                        ))}
                    </div>
                )
            )}
        </div>
    );
}