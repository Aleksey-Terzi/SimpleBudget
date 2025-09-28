import { fetchHelper } from "@/api/fetchHelper";
import { Link } from "react-router";

export default function UserHeader() {
    if (!fetchHelper.getToken()) {
        return null;
    }

    return (
        <>
            <span className="font-bold me-3">
                {fetchHelper.getUsername()}
            </span>
            <Link
                to="/security/login"
                className="underline hover:text-blue-hover"
            >
                Logout
            </Link>
        </>
    )
}