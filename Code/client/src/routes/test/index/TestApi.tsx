import { ApiError } from "@/api/ApiError";
import { restClient } from "@/api/restClient";
import Button from "@/components/Button";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";
import { useToast } from "@/contexts/ToastProvider";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
    username: string;
    password: string;
}

export default function TestApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [wallet, setWallet] = useState<string | null>(null);

    const { register, handleSubmit: handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            username: "aleks",
            password: "aleks",
        }
    });

    const { showToast } = useToast();

    async function handleValidSubmit({ username, password }: FormValues) {
        setIsLoading(true);
        try {
            const { token } = await restClient.login(username, password);
            setToken(token);
            showToast("Logged in", "info");
        } catch (e) {
            showToast((e as ApiError).message, "error");
        }
        setIsLoading(false);
    }

    async function getWallets() {
        setIsLoading(true);
        try {
            const wallets = await restClient.wallets.all();
            setWallet(JSON.stringify(wallets[0]));
            showToast("Wallets have been successfully loaded", "info");
        } catch (e) {
            setWallet(null);
            showToast((e as ApiError).message, "error");
        }
        setIsLoading(false);
    }

    return (
        <>
            <div className="grid grid-cols-[1fr,2fr] gap-3">
                <div>
                    <form autoComplete="off" onSubmit={handleSubmit(handleValidSubmit)}>
                        <FormField label="Username" required>
                            <TextInput
                                {...register("username", {
                                    required: true
                                })}
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
                            <Button onClick={() => {
                                restClient.logout();
                                setToken(null);
                            }}>Logout</Button>
                        </div>
                    </form>                
                </div>
                <div>
                    <strong>Token:</strong>
                    <div className="break-all">
                        {token ?? "None"}
                    </div>
                </div>
                <div className="pt-4">
                    <Button loadingText="Submitting..." isLoading={isLoading} onClick={getWallets}>
                        GET /api/wallets
                    </Button>
                </div>
                <div className="pt-4 break-all">
                    {wallet ?? ""}
                </div>
            </div>
        </>
    )
}