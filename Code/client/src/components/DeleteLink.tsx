import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Props {
    to: string;
    disabled: boolean;
    className?: string;
}

export default function DeleteLink(props: Props) {
    return (
        props.disabled ? (
            <Button variant="danger" disabled className={props.className}>
                Delete
            </Button>
        ) : (
            <Link to={props.to} className={`btn btn-danger ${props.className || ""}`} >
                Delete
            </Link>
        )
    )
}