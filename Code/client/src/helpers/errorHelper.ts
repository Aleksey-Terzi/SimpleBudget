import { FieldError } from "react-hook-form";

export const errorHelper = {
    getErrorTooltip(error: FieldError | undefined): string | undefined {
        if (!error) {
            return undefined;
        }
        if (error.message) {
            return error.message;
        }
    
        switch (error.type) {
            case "required":
                return "The field is required";
        }
    
        throw new Error(`Unknown error type: ${error.type}`);
    },
    getErrorDescription(error: unknown, details?: string | null) {
        let errorMessage = error instanceof Error && error.message
            ? error.message
            : typeof error === "string"
                ? error
                : "Unknown error";

        if (details) {
            errorMessage = details + ": " + errorMessage;
        }

        return errorMessage;
    }
}