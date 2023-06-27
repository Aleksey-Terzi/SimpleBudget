import { useEffect, useState } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import GridPagination, { PageClickEvent } from "../../../components/GridPagination";
import LoadingPanel from "../../../components/LoadingPanel";
import { PaginationData } from "../../../models/pagination";
import dateHelper from "../../../utils/dateHelper";
import requestHelper from "../../../utils/requestHelper";
import responseHelper from "../../../utils/responseHelper";
import { CurrencyRateGridModel } from "../models/currencyRateGridModel";
import * as yup from "yup"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface Props {
    currencyId: number;
}

export default function CurrencyRatingGrid({ currencyId }: Props) {
    const [items, setItems] = useState<CurrencyRateGridModel[]>();
    const [paginationData, setPaginationData] = useState<PaginationData>();
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [editedId, setEditedId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | undefined>();

    const validationSchema = yup.object().shape({
        startDate: yup.date()
            .typeError("Start Date is a required field")
            .required("Start Date is a required field"),
        rate: yup.number()
            .typeError("Rate is a required field")
            .min(0)
            .max(100)
            .required("Rate is a required field"),
        bankOfCanada: yup.boolean()
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        mode: "onTouched",
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        setLoading(true);

        requestHelper.Currencies.getRates(currencyId)
            .then(r => {
                setItems(r.items);
                setPaginationData(r.paginationData);
                setSelectedId(undefined);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            });
    }, [currencyId]);

    function onAddRateClick() {
        reset();

        const newItems = [...items!];

        newItems.splice(0, 0, {
            currencyRateId: -1,
            startDate: dateHelper.dateToString(new Date()),
            formattedStartDate: "",
            rate: 0,
            bankOfCanada: false
        });

        setItems(newItems);
        setEditedId(-1);
    }

    function onPageClick(e: PageClickEvent) {
        setLoading(true);

        requestHelper.Currencies.getRates(currencyId, e.page)
            .then(r => {
                setItems(r.items);
                setPaginationData(r.paginationData);
                setSelectedId(undefined);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function onEditClick(e: any, id: number) {
        e.preventDefault();

        reset();

        setSelectedId(undefined);
        setEditedId(id);
    }

    function onCancelClick(e: any) {
        e.preventDefault();

        if (editedId === -1) {
            const newItems = [...items!];
            newItems.splice(0, 1);
            setItems(newItems);
        }

        setEditedId(undefined);
    }

    function onDeleteClick(e: any, id: number) {
        e.preventDefault();

        if (!window.confirm("Are you sure to delete this rate?")) {
            return;
        }

        setDeletingId(id);

        requestHelper.Currencies.deleteRate(currencyId, id)
            .then(r => {
                setItems(r.items);
                setPaginationData(r.paginationData);
                setSelectedId(undefined);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setDeletingId(undefined);
            })
    }

    function onSave(values: any) {
        const model = {
            startDate: dateHelper.dateToString(values["startDate"] as Date),
            rate: values["rate"],
            bankOfCanada: values["bankOfCanada"]
        };

        setSaving(true);

        const promise = editedId === -1
            ? requestHelper.Currencies.createRate(currencyId, model)
            : requestHelper.Currencies.updateRate(currencyId, editedId!, model);

        promise
            .then(r => {
                setItems(r.items);
                setPaginationData(r.paginationData);
                setSelectedId(r.paginationData.id);
                setEditedId(undefined);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setSaving(false);
            })
    }

    return (
        <Card className="h-100">
            <Card.Header>
                <Card.Title>
                    Currency Rates
                    {paginationData && <small className="ms-1">({paginationData.totalItems})</small>}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <div className="mb-3">
                    <Button variant="secondary" disabled={loading || !items || !!editedId || !!deletingId} onClick={onAddRateClick}>
                        <i className="bi-plus-circle me-1"></i>
                        Add Rate
                    </Button>
                </div>

                <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSave)}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th className="w-25">Start Date</th>
                                <th className="w-25 text-end">Rate</th>
                                <th className="w-25 text-center">Bank Of Canada</th>
                                <th className="w-25"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!error && !loading && items && (
                                items.map(p => (
                                    <tr key={p.currencyRateId} className={selectedId && selectedId === p.currencyRateId ? "selected" : ""}>
                                        <td className="text-nowarp">
                                            {editedId === p.currencyRateId ? (
                                                <Form.Control
                                                    autoFocus={true}
                                                    type="date"
                                                    maxLength={10}
                                                    defaultValue={p.startDate}
                                                    disabled={saving}
                                                    isInvalid={!!errors.startDate}
                                                    title={errors.startDate?.message as string}
                                                    {...register("startDate")}
                                                />
                                            ): <>{p.formattedStartDate}</>}
                                        </td>
                                        <td className="text-end">
                                            {editedId === p.currencyRateId ? (
                                                <Form.Control
                                                    type="text"
                                                    className="text-end"
                                                    maxLength={10}
                                                    defaultValue={p.currencyRateId !== -1 ? p.rate.toFixed(4) : ""}
                                                    disabled={saving}
                                                    isInvalid={!!errors.rate}
                                                    title={errors.rate?.message as string}
                                                    {...register("rate")}
                                                />
                                            ) : (
                                                <>{p.rate.toFixed(4)}</>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {editedId === p.currencyRateId ? (
                                                <Form.Check
                                                    type="checkbox"
                                                    defaultChecked={p.bankOfCanada}
                                                    disabled={saving}
                                                    {...register("bankOfCanada")}
                                                />
                                            ) : (
                                                <>{p.bankOfCanada ? "Yes" : ""}</>
                                            )}
                                        </td>
                                        <td className="text-nowrap text-end">
                                            {editedId === p.currencyRateId ? (
                                                <>
                                                    {!saving ? (
                                                        <button type="submit" title="Save" className="btn btn-link p-1">
                                                            <i className="bi-save"></i>
                                                        </button>
                                                    ) : (
                                                        <Spinner animation="border" size="sm" role="status" className="p-1" />
                                                    )}
                                                    <button title="Cancel" className="btn btn-link p-1" onClick={onCancelClick} disabled={saving}>
                                                        <i className="bi-x-lg"></i>
                                                    </button>
                                                </>
                                            ): (
                                                <>
                                                    <button
                                                        title="Edit"
                                                        className="btn btn-link p-1"
                                                        onClick={e => onEditClick(e, p.currencyRateId)}
                                                        disabled={!!editedId || !!deletingId}
                                                    >
                                                        <i className="bi-pencil"></i>
                                                    </button>
                                                    {deletingId === p.currencyRateId ? (
                                                        <Spinner animation="border" size="sm" role="status" className="p-1" />
                                                    ): (
                                                        <button
                                                            title="Delete"
                                                            className="btn btn-link p-1"
                                                            disabled={!!editedId || !!deletingId}
                                                            onClick={e => onDeleteClick(e, p.currencyRateId)}
                                                        >
                                                            <i className="bi-x-lg"></i>
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Form>

                {!error && !loading && items && paginationData && (
                    <GridPagination paginationData={paginationData} pageClick={onPageClick} disabled={!!editedId} />
                )}

                {loading && <LoadingPanel text="Loading Rates..." />}

                {!loading && error && (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
}