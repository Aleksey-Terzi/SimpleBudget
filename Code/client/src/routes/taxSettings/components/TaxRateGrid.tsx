import { Button } from "react-bootstrap";
import { FieldValues, UseFormReturn } from "react-hook-form";
import LoadingPanel from "../../../components/LoadingPanel";
import NumericInput from "../../../components/NumericInput";
import { TaxRateGridModel } from "../models/taxRateGridModel";

interface Props {
    rates?: TaxRateGridModel[];
    useFormReturn: UseFormReturn<FieldValues, any>,
    loading: boolean;
    saving: boolean;
    onAddRate: () => void;
    onDeleteRate: (id: number) => void;
}

export default function TaxRateGrid(props: Props) {
    const wwwTaxRates = (
        <a
            href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html"
            target="_blank"
            tabIndex={-1}
        >
            www.canada.ca/tax-rates
        </a>
    );

    function onAddRateClick(e: any) {
        e.preventDefault();
        props.onAddRate();
    }

    function onDeleteRateClick(e: any, id: number) {
        e.preventDefault();
        props.onDeleteRate(id);
    }

    return (
        <>
            <div className="mb-3">
                <Button
                    variant="secondary"
                    disabled={props.loading || !props.rates || props.saving}
                    onClick={onAddRateClick}
                    tabIndex={-1}
                >
                    <i className="bi-plus-circle me-1"></i>
                    Add Rate
                </Button>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Rate %</th>
                        <th>Max Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {!props.loading && props.rates && props.rates.map(rate => (
                        <tr key={rate.id}>
                            <td>
                                <NumericInput
                                    name={rate.rateFieldName}
                                    type="percent"
                                    maxLength={5}
                                    defaultValue={rate.rate}
                                    disabled={props.saving}
                                    useFormReturn={props.useFormReturn}
                                />
                            </td>
                            <td>
                                <NumericInput
                                    name={rate.maxAmountFieldName}
                                    type="money"
                                    maxLength={20}
                                    defaultValue={rate.maxAmount}
                                    disabled={props.saving}
                                    useFormReturn={props.useFormReturn}
                                />
                            </td>
                            <td>
                                <button
                                    type="button"
                                    title="Delete"
                                    className="btn btn-link p-1"
                                    disabled={props.saving}
                                    onClick={e => onDeleteRateClick(e, rate.id)}
                                    tabIndex={-1}
                                >
                                    <i className="bi-x-lg"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {wwwTaxRates}

            {props.loading && <LoadingPanel text="Loading Rates..." />}
        </>
    );
}