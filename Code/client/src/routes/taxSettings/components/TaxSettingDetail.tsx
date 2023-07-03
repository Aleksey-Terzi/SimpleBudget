import { TaxSettingEditModel } from "../models/taxSettingEditModel";
import { FieldValues, UseFormReturn } from "react-hook-form";
import NumericInput from "../../../components/NumericInput";

interface Props {
    model?: TaxSettingEditModel;
    useFormReturn: UseFormReturn<FieldValues, any>,
    saving: boolean;
}

export default function TaxSettingDetail({ model, useFormReturn, saving }: Props) {
    const wwwCpp = (
        <a
            href="https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/canada-pension-plan-cpp/cpp-contribution-rates-maximums-exemptions.html"
            target="_blank"
            tabIndex={-1}
            rel="noreferrer"
        >
            www.canada.ca/cpp
        </a>
    );

    const wwwEi = (
        <a
            href="https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/employment-insurance-ei/ei-premium-rates-maximums.html"
            target="_blank"
            tabIndex={-1}
            rel="noreferrer"
        >
            www.canada.ca/ei
        </a>
    );

    const wwwFederalBasicPersonalAmount = (
        <a
            href="https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/federal-government-budgets/basic-personal-amount.html"
            target="_blank"
            tabIndex={-1}
            rel="noreferrer"
        >
            www.canada.ca/federal
        </a>
    );

    const wwwProvincialBasicPersonalAmount = (
        <a
            href="https://www.alitis.ca/insights/tax-rates-alberta/"
            target="_blank"
            tabIndex={-1}
            rel="noreferrer"
        >
            www.alitis.ca/alberta
        </a>
    );

    const wwwCanadaEmploymentBaseAmount = (
        <a
            href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-31260-canada-employment-amount.html"
            target="_blank"
            tabIndex={-1}
            rel="noreferrer"
        >
            www.canada.ca/tax-return
        </a>
    );

    return (
        <>
            <div className="mb-3">
                <label className="form-label">CPP Rate %</label>
                <div>
                    <NumericInput
                        name="cppRate"
                        type="percent"
                        autoFocus={true}
                        className="w-50 d-inline me-3"
                        maxLength={5}
                        defaultValue={model?.cppRate}
                        disabled={saving}
                        useFormReturn={useFormReturn}
                    />
                    {wwwCpp}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">CPP Max Amount</label>
                <div>
                    <NumericInput
                        name="cppMaxAmount"
                        type="money"
                        className="w-50 d-inline me-3"
                        maxLength={20}
                        defaultValue={model?.cppMaxAmount}
                        disabled={saving}
                        useFormReturn={useFormReturn}
                    />
                    {wwwCpp}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">EI Rate %</label>
                <div>
                    <NumericInput
                        name="eiRate"
                        type="percent"
                        className="w-50 d-inline me-3"
                        maxLength={5}
                        defaultValue={model?.eiRate}
                        disabled={saving}
                        useFormReturn={useFormReturn}
                    />
                    {wwwEi}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">EI Max Amount</label>
                <div>
                    <NumericInput
                        name="eiMaxAmount"
                        type="money"
                        className="w-50 d-inline me-3"
                        maxLength={20}
                        defaultValue={model?.eiMaxAmount}
                        disabled={saving}
                        useFormReturn={useFormReturn}
                    />
                    {wwwEi}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">CPP Basic Exemption Amount</label>
                <div>
                    <NumericInput
                        name="cppBasicExemptionAmount"
                        type="money"
                        className="w-50 d-inline me-3"
                        maxLength={20}
                        defaultValue={model?.cppBasicExemptionAmount}
                        disabled={saving}
                        useFormReturn={useFormReturn}
                    />
                    {wwwCpp}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Federal Basic Personal Amount</label>
                <div>
                    <NumericInput
                        name="federalBasicPersonalAmount"
                        type="money"
                        className="w-50 d-inline me-3"
                        maxLength={20}
                        defaultValue={model?.federalBasicPersonalAmount}
                        disabled={saving}
                        useFormReturn={useFormReturn}
                    />
                    {wwwFederalBasicPersonalAmount}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Provincial Basic Personal Amount</label>
                <div>
                    <NumericInput
                        name="provincialBasicPersonalAmount"
                        type="money"
                        className="w-50 d-inline me-3"
                        maxLength={20}
                        defaultValue={model?.provincialBasicPersonalAmount}
                        disabled={saving}
                        useFormReturn={useFormReturn}
                    />
                    {wwwProvincialBasicPersonalAmount}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Canada Employment Base Amount</label>
                <div>
                    <NumericInput
                        name="canadaEmploymentBaseAmount"
                        type="money"
                        className="w-50 d-inline me-3"
                        maxLength={20}
                        defaultValue={model?.canadaEmploymentBaseAmount}
                        disabled={saving}
                        useFormReturn={useFormReturn}
                    />
                    {wwwCanadaEmploymentBaseAmount}
                </div>
            </div>
        </>
    );
}