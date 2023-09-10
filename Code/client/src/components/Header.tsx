import { Link, NavLink } from "react-router-dom";
import paymentFilterHelper from "../routes/payments/utils/paymentFilterHelper";
import planPaymentFilterHelper from "../routes/plans/utils/planPaymentFilterHelper";
import { useAppSelector } from "../utils/storeHelper";
import userHelper from "../utils/userHelper";

export default function Header() {
    const { filter: paymentFilter } = useAppSelector(state => state.payment);
    const paymentsUrl = paymentFilterHelper.getPaymentsUrl(paymentFilter);
    const { filter: planPaymentFilter } = useAppSelector(state => state.planPayment);
    const planPaymentsUrl = planPaymentFilterHelper.getPlanPaymentsUrl(planPaymentFilter);
    const user = userHelper.getUser();

    return (
        <header>
            <nav className="navbar fixed-top navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container">
                    <Link to="/payments" className="navbar-brand">Budget</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item">
                                <NavLink className="nav-link" to={paymentsUrl}>Payments</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/productprices">Prices</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/reports/summary">Summary</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/reports/monthly">Monthly Report</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/taxes">Taxes</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/dictionaries">Dictionaries</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to={planPaymentsUrl}>Plans</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="float-end">
                        <b className="me-3">{user?.username}</b>
                        <Link to="/login">
                            Logout
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}