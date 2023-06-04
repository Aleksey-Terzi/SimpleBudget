import { Spinner, Stack } from "react-bootstrap";

interface Props {
    text: string;
}

export default function LoadingPanel({ text }: Props) {
    return (
        <Stack direction="horizontal" className="d-flex justify-content-center" style={{ height: "200px" }}>
            <Spinner animation="border" role="status" className="me-3" />
            {text}
        </Stack>
    );
}