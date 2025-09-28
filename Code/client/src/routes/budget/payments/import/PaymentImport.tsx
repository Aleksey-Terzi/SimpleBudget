import { SuggestedPaymentModel } from "@/api/models/SuggestedPaymentModel";
import { restClient } from "@/api/restClient";
import Button from "@/components/Button";
import { useStatusProvider } from "@/contexts/StatusProvider";
import FormSection from "@/components/form/FormSection";
import { useEffect, useRef, useState } from "react";
import PaymentImport_Grid from "./PaymentImport_Grid";
import { useNavigate } from "react-router";
import { NewImportModel } from "@/api/models/NewImportModel";
import { useToast } from "@/contexts/ToastProvider";
import LoadingProvider from "@/contexts/LoadingProvider";
import { cache } from "@/cache/cache";

interface InitialData {
    format: string;
    payments: SuggestedPaymentModel[];
}

export default function PaymentImport() {
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [initialData, setInitialData] = useState<InitialData | null>(null);

    const { addError, removeError } = useStatusProvider();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const fileRef = useRef<HTMLInputElement>(null);

     useEffect(() => {
        if (!fileRef.current) {
            return;
        }

        const fileInput = fileRef.current;

        fileInput.addEventListener("change", onChange);

        return () => fileInput.removeEventListener("change", onChange);

        async function onChange() {
            if (!fileInput.files || !fileInput.files.length) {
                return;
            }

            setIsUploadingFile(true);

            try {
                const result = await restClient.import.upload(fileInput.files[0]);

                if (!result.error && result.payments.length === 0) {
                    addError("This file does not contain new payments");
                } else if (result.error) {
                    addError(result.error);
                } else {
                    setInitialData({
                        format: result.valueFormat,
                        payments: result.payments
                    });
                    removeError();                    
                }
            } catch (err) {
                addError(err, "Failed to process the file");
            } finally {
                setIsUploadingFile(false);
                fileInput.value = "";
            }
        }
    }, [addError, removeError]);


    async function handleSave(model: NewImportModel) {
        if (!initialData) {
            throw new Error("Unexpected error, initData is not defined");
        }

        if (!model.payments.length) {
            showToast("No payments selected", "error");
            return;
        }

        if (!window.confirm(`Are you sure to import ${model.payments.length} payment(s) to ${model.wallet}?`)) {
            return;
        }

        setIsSaving(true);

        let ids: number[];

        try {
            ids = await restClient.import.save(model);
        } catch (err) {
            addError(err, "Failed to import payments");
            return;
        } finally {
            setIsSaving(false);
        }

        showToast(`${ids.length} payment(s) have been imported`, "info");

        const categories = model.payments.filter(x => x.category).map(x => x.category!);
        const companies = model.payments.filter(x => x.company).map(x => x.company!);

        cache.onPaymentChanged(ids.length ? ids[0] : null, categories, companies);

        navigate("/budget/payments");
    }

    return (
        <LoadingProvider disabled>
            <FormSection>
                <div>
                    <Button
                        type="button"
                        disabled={isSaving}
                        isLoading={isUploadingFile}
                        loadingText="Processing selected file..."
                        icon="arrow-up-tray"
                        onClick={() => fileRef.current?.click()}
                    >
                        Load payments from the TD CSV file
                    </Button>
                    <input
                        ref={fileRef}
                        type="file"
                        className="hidden"
                    />
                </div>
                {initialData && !isUploadingFile && (
                    <PaymentImport_Grid
                        format={initialData.format}
                        payments={initialData.payments}
                        isSaving={isSaving}
                        onSave={handleSave}
                    />
                )}
            </FormSection>
        </LoadingProvider>
    )
}