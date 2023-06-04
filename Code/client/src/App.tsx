import Header from './components/Header';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function App() {
    const location = useLocation();

    return location.pathname === "/" ? (
        <Navigate to="/payments" />
    ): (
        <>
            <Header />

            <div className="container container-body pb-5">
                <div className="pb-3">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default App;
