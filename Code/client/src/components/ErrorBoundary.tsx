import React, { ReactNode } from "react";
import Alert from "./Alert";

interface Props {
    children?: ReactNode;
}

interface State {
    error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <Alert type="error">
                    {this.state.error.message ?? "Unknown error"}
                </Alert>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;