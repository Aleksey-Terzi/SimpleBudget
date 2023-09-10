import { KeyboardEvent, useRef } from "react";
import { Button, Col, Form, Row, Stack, } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ProductPriceFilterModel } from "../models/productPriceFilterModel";
import filterHelper from "../utils/productPriceFilterHelper";
import { useForm } from "react-hook-form";

interface Props {
    filter: ProductPriceFilterModel;
    loading: boolean;
}

interface FormValues {
    keyword: string;
}

export default function ProductPriceFilter({ filter, loading }: Props) {
    const navigate = useNavigate();

    const keywordRef = useRef<HTMLInputElement | null>(null);

    const { register, handleSubmit, getValues, setValue } = useForm<FormValues>({
        mode: "onTouched",
        defaultValues: {
            keyword: filter.keyword || ""
        }
    });

    const { ref: keywordFormRef, ...keywordFormRest } = register("keyword");

    function onSearch(values: FormValues) {
        const searchFilter = { ...filter, keyword: values.keyword, page: undefined };
        const filterParams = filterHelper.getFilterParams(searchFilter);
        const url = "?" + (filterParams || "");

        keywordRef.current!.focus();

        navigate(url);
    }

    function keyword_onKeyDown(e: KeyboardEvent) {
        if (e.code === "Enter") {
            onSearch(getValues());
        }
    }

    function onClear() {
        setValue("keyword", "");
        onSearch(getValues());
    }

    return (
        <Row className="mb-3">
            <Col lg="6">
                <Form noValidate onSubmit={handleSubmit(onSearch)} autoComplete="off">
                    <Stack direction="horizontal">
                        <Form.Control
                            type="text"
                            className="me-1"
                            maxLength={100}
                            placeholder="Keyword"
                            autoComplete="off"
                            disabled={loading}
                            onKeyDown={keyword_onKeyDown}
                            {...keywordFormRest}
                            ref={(e: any) => {
                                keywordFormRef(e);
                                keywordRef.current = e;

                                e?.focus();
                            }}
                        />
                        <Button
                            type="submit"
                            variant="link"
                            className="p-1"
                            title="Filter"
                            disabled={loading}
                        >
                            <i className="bi-search"></i>
                        </Button>
                        <Button
                            variant="link"
                            className="p-1"
                            title="Clear Keyword"
                            disabled={loading}
                            onClick={onClear}
                        >
                            <i className="bi-x-lg"></i>
                        </Button>
                    </Stack>
                </Form>
            </Col>
            <Col lg="6">
                <div className="float-end mb-3">
                    <Link className="btn btn-secondary" to="/productprices/add" tabIndex={-1}>
                        <i className="bi-plus-circle me-1"></i>
                        Add Price
                    </Link>
                    <Link className="btn btn-secondary ms-1" to="/productprices/addmulti" tabIndex={-1}>
                        <i className="bi-plus-circle me-1"></i>
                        Add Multiple Prices
                    </Link>
                </div>
            </Col>
        </Row>
    );
}
