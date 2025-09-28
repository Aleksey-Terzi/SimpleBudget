import { Link, useRouteError } from "react-router";

export default function Error() {
    const error = useRouteError();

    return (
        <div>
            <h1>Something went wrong</h1>
            <p>{JSON.stringify(error)}</p>

            <Link to="/">Navigate Home</Link>
        </div>
    );
}