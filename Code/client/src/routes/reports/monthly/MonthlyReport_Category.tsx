import { MonthlyCategoryModel } from "@/api/models/MonthlyCategoryModel";
import AmountField from "@/components/fields/AmountField";
import FormTitle from "@/components/form/FormTitle";
import Grid from "@/components/Grid";
import { searchHelper } from "@/components/search/searchHelper";
import { numberHelper } from "@/helpers/numberHelper";
import { createPaymentCriteria } from "@/routes/budget/payments/index/PaymentCriteria";
import { Link } from "react-router";

interface Props {
    year: number;
    month: number;
    showWeekly: boolean;
    categories: MonthlyCategoryModel[];
    format: string;
    balanceDiff: number;
}

export default function MonthlyReport_Category({
    year,
    month,
    showWeekly,
    categories,
    format,
    balanceDiff,
}: Props) {
    let totalMonthCAD = 0;
    let totalPlanCAD = 0;
    let totalNeedCAD = 0;
    let totalWeekCAD = 0;

    for (const category of categories) {
        totalMonthCAD += numberHelper.fromServerDecimal(category.monthCAD);
        totalPlanCAD += numberHelper.fromServerDecimal(category.planCAD);
        totalNeedCAD += numberHelper.fromServerDecimal(category.needCAD);
        totalWeekCAD += numberHelper.fromServerDecimal(category.weekCAD);
    }

    const columns = [
        { className: "text-start", title: "Category" },
        { className: "text-end", title: "Month" },
        { className: "text-end", title: "Plan" },
        { className: "text-end", title: "Need" },
    ];

    if (showWeekly) {
        columns.push({ className: "text-end", title: "Week" });
    }

    return (
        <div>
            <FormTitle>Spendings by Categories</FormTitle>

            <Grid className="mb-3" columns={columns}>
                {categories.map(({ categoryName, monthCAD, planCAD, needCAD, weekCAD }) => (
                    <tr key={categoryName}>
                        <td>
                            <Link
                                className="underline hover:text-blue-hover"
                                to={`/report/monthly-report/payments?${searchHelper.serializeParams(0, createPaymentCriteria(year, month, categoryName))}`}
                            >
                                {categoryName}
                            </Link>                            
                        </td>
                        <td className="text-end">
                            <AmountField amount={numberHelper.fromServerDecimal(monthCAD)} format={format} highlight="zero" />
                        </td>
                        <td className="text-end">
                            <AmountField amount={numberHelper.fromServerDecimal(planCAD)} format={format} highlight="zero" />
                        </td>
                        <td className="text-end">
                            <AmountField amount={numberHelper.fromServerDecimal(needCAD)} format={format} highlight="expenses and zero" />
                        </td>
                        {showWeekly && (
                            <td className="text-end">
                                <AmountField amount={numberHelper.fromServerDecimal(weekCAD)} format={format} highlight="zero" />
                            </td>
                        )}
                    </tr>
                ))}
                <tr className="font-semibold">
                    <td colSpan={2} className="text-end">
                        <AmountField amount={totalMonthCAD} format={format} />
                    </td>
                    <td className="text-end">
                        <AmountField amount={totalPlanCAD} format={format} />
                    </td>
                    <td className="text-end">
                        <AmountField amount={totalNeedCAD} format={format} highlight="income and expenses" />
                    </td>
                    {showWeekly && (
                        <td className="text-end">
                            <AmountField amount={totalWeekCAD} format={format} />
                        </td>
                    )}
                </tr>
            </Grid>
            <div className="text-end font-semibold p-1">
                Expected balance change:
                &nbsp;
                <AmountField amount={balanceDiff} format={format} highlight="income and expenses" />
                &nbsp;-&nbsp;
                <AmountField amount={totalNeedCAD} format={format} />
                &nbsp;=&nbsp;
                <AmountField amount={balanceDiff + totalNeedCAD} format={format} highlight="income and expenses" />
            </div>
        </div>
    )
}