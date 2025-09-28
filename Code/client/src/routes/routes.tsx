import { Navigate, RouteObject } from "react-router";
import Error from "@/components/Error";
import { HOME_URL } from "@/helpers/settings";
import Login from "./security/login";
import AppLayout from "../layout/AppLayout";
import { formRouteHelper } from "./formRouteHelper";

const children = [
    { index: true, element: <Navigate replace to={HOME_URL} /> },
    ...formRouteHelper.routeObjects
];

export const routes: RouteObject[] = [
    {
        path: "/security/login",
        element: <Login />,
    },
    {
        element: <AppLayout />,
        errorElement: <Error />,
        children
    }
];
