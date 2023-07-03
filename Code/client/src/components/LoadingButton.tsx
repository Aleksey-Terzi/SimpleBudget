import { ReactNode } from "react";
import { Button, Spinner } from "react-bootstrap";

interface Props {
    variant: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark" | "link" | "outline-secondary";
    className?: string;
    loading: boolean;
    text?: string;
    loadingText?: string;
    disabled?: boolean;
    tabIndex?: number;
    children?: ReactNode;
    onClick?: (e: any) => void;
}

export default function LoadingButton(props: Props) {
    const type = props.onClick ? "button" : "submit";

    return (
        <Button
            variant={props.variant}
            type={type}
            className={props.className}
            disabled={props.loading || props.disabled === true}
            tabIndex={props.tabIndex}
            onClick={props.onClick}
        >
            {props.loading ? (
                <>
                    <Spinner animation="border" size="sm" role="status" className="me-1" />
                    {props.loadingText}
                </>
            ) : props.text || !props.children ? props.text : props.children}
        </Button>
    )
}