import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "@/api/ApiError";
import { restClient } from "@/api/restClient";
import Button from "@/components/Button";
import FormField from "@/components/form/FormField";
import FormSection from "@/components/form/FormSection";
import TextInput from "@/components/inputs/TextInput";
import { useToast } from "@/contexts/ToastProvider";
import { useNavigate, useSearchParams } from "react-router";
import { HOME_URL } from "@/helpers/settings";

interface FormValues {
    username: string;
    password: string;
}

export default function Login() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit: handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            username: "",
            password: "",
        }
    });

    const { showToast, clearToasts } = useToast();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        clearToasts();

        const body = document.querySelector("body") as HTMLBodyElement;
        body.classList.add("flex", "items-center", "justify-center", "h-screen");

        restClient.logout();

        setIsInitialized(true);

        return () => body.classList.remove("flex", "items-center", "justify-center", "h-screen");
    }, []);

    async function handleValidSubmit({ username, password }: FormValues) {
        setIsLoading(true);
        try {
            await restClient.login(username, password);
            showToast("Logged in", "info");

            const url = searchParams.get("returnUrl") ?? HOME_URL;
            navigate(url);
        } catch (e) {
            showToast((e as ApiError).message, "error");
        }
        setIsLoading(false);
    }

    if (!isInitialized) {
        return null;
    }

    return (
        <FormSection className="h-full m-auto w-96">
            <div className="text-base mb-6">
                Login to Simple Budget
            </div>

            <form autoComplete="off" onSubmit={handleSubmit(handleValidSubmit)}>
                <FormField label="Username" required>
                    <TextInput
                        {...register("username", {
                            required: true
                        })}
                        autoFocus
                        readOnly={isLoading}
                        error={errors.username}
                    />
                </FormField>
                <FormField label="Password" required>
                    <TextInput
                        type="password"
                        {...register("password", {
                            required: true
                        })}
                        readOnly={isLoading}
                        error={errors.password}
                    />
                </FormField>
                <div className="flex gap-2">
                    <Button
                        variant="submit"
                        icon="arrow-right-end-on-rectangle"
                        isLoading={isLoading}
                    >
                        Login
                    </Button>
                </div>
            </form> 
        </FormSection>
    )
}