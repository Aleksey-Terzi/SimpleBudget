import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from "react";
import Alert, { AlertType } from "../components/Alert";
import { errorHelper } from "@/helpers/errorHelper";
import { useToast } from "./ToastProvider";

interface ContextData {
    addError: (key: string, error: unknown, details?: string | null) => void;
    removeError: (key: string) => void;
    addStatus: (key: string, alertType: AlertType, message: string) => void;
    removeStatus: (key: string) => void;
}

const StatusProviderContext = createContext<ContextData>({
    addError: () => {},
    removeError: () => {},
    addStatus: () => {},
    removeStatus: () => {},
});

interface AddErrorAction {
    type: "addError";
    key: string;
    error: unknown;
    details: string | null | undefined;
}

interface RemoveErrorAction {
    type: "removeError";
    key: string;
}

interface AddStatusAction {
    type: "addStatus";
    key: string;
    alertType: AlertType;
    message: string;
}

interface RemoveStatusAction {
    type: "removeStatus";
    key: string;
}


type Action  = AddErrorAction | RemoveErrorAction | AddStatusAction | RemoveStatusAction;

interface State {
    errors: {
        key: string;
        error: unknown;
        details: string | null | undefined;
    }[];
    statuses: {
        key: string;
        alertType: AlertType;
        message: string;
    }[];
}

const _initialState: State = {
    errors: [],
    statuses: [],
}

function reducer(state: State, action: Action) {
    const { type } = action;
    switch (type) {
        case "addError":
            return {...state, errors: [
                ...state.errors.filter(x => x.key !== action.key),
                {
                    key: action.key,
                    error: action.error,
                    details: action.details,
                }
            ]};
        case "removeError":
            return {...state, errors: [...state.errors.filter(x => x.key !== action.key)]};
        case "addStatus":
            return {...state, statuses: [
                ...state.statuses.filter(x => x.key !== action.key),
                {
                    key: action.key,
                    alertType: action.alertType,
                    message: action.message,
                }
            ]};
        case "removeStatus":
            return {...state, statuses: [...state.statuses.filter(x => x.key !== action.key)]};
        default:
            throw new Error(`Unknown action: ${type}`);
    }
}

interface Props {
    className?: string;
    children?: ReactNode;
}

export default function StatusProvider({ className, children }: Props) {
    const [{ errors, statuses }, dispatch] = useReducer(reducer, _initialState);
    const { showToast } = useToast();

    const providerValue = useMemo(() => ({
        addError: (key: string, error: unknown, details?: string | null) => {
            let errorMessage = errorHelper.getErrorDescription(error, details);
            if (errorMessage.length > 50) {
                errorMessage = errorMessage.substring(0, 50) + "...";
            }
            showToast(errorMessage, "error");
            dispatch({
                type: "addError",
                key,
                error,
                details,
            });
        },
        removeError: (key: string) => {
            dispatch({
                type: "removeError",
                key,
            });
        },
        addStatus: (key: string, alertType: AlertType, message: string) => {
            dispatch({
                type: "addStatus",
                key,
                alertType,
                message,
            });
        },
        removeStatus: (key: string) => {
            dispatch({
                type: "removeStatus",
                key,
            });
        },
    }), [showToast]);

    const errorList = useMemo(() => {
        if (errors.length === 0) {
            return null;
        }
        if (errors.length === 1) {
            return errorHelper.getErrorDescription(errors[0].error, errors[0].details);
        }
        return (
            <>
                <strong>Errors:</strong>
                <ul className="mt-1 list-disc list-inside">
                    {errors.map(({ error, details }) => (
                        <li>
                            {errorHelper.getErrorDescription(error, details)}
                        </li>
                    ))}
                </ul>
            </>
        )
    }, [errors]);

    return (
        <StatusProviderContext.Provider value={providerValue}>
            {errorList && (
                <Alert type="error" className={`mb-3 ${className}`}>
                    {errorList}
                </Alert>
            )}
            {statuses.length > 0 && (
                statuses.map(({ key, alertType, message }) => (
                    <Alert key={key} type={alertType} className="mb-3">
                        {message}
                    </Alert>
                ))
            )}
            {children}
        </StatusProviderContext.Provider>
    )
}

let _counter = 1;

// eslint-disable-next-line react-refresh/only-export-components
export function useStatusProvider() {
    const { addError, removeError, addStatus, removeStatus } = useContext(StatusProviderContext);
    const [key] = useState(() => `sequential-status-key.${_counter++}`);

    const methods = useMemo(() => ({
        addError: (error: unknown, details?: string | null) => addError(key, error, details),
        removeError: () => removeError(key),
        addStatus: (alertType: AlertType, message: string) => addStatus(key, alertType, message),
        removeStatus: () => removeStatus(key),
    }), [addError, removeError, addStatus, removeStatus, key]);

    useEffect(() => () => {
        removeError(key);
        removeStatus(key);
    }, [removeError, removeStatus, key]);

    return methods;
}