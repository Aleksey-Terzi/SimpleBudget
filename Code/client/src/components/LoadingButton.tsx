import { Button, Spinner } from "react-bootstrap";

interface Props {
    variant: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark" | "link";
    className?: string;
    loading: boolean;
    text: string;
    loadingText?: string;
    disabled?: boolean;
    onClick?: (e: any) => void;
}

export default function LoadingButton({ variant, className, loading, text, loadingText, disabled, onClick }: Props) {
    const type = onClick ? "button" : "submit";

    return (
        <Button
            variant={variant}
            type={type}
            className={className}
            disabled={loading || disabled === true}
            onClick={onClick}
        >
            {loading ? (
                <>
                    <Spinner animation="border" size="sm" role="status" className="me-1" />
                    {loadingText}
                </>
            ) : text}
        </Button>
    )
}