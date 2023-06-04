import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Props {
    to: string;
    disabled: boolean;
}

export default function DeleteLink({ to, disabled }: Props) {
    return (
        disabled ? (
            <Button variant="danger" disabled>
                Delete
            </Button>
        ) : (
            <Link to={to} className="btn btn-danger">
                Delete
            </Link>
        )
    )
}