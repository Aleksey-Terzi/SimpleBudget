import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes/routes";
import ToastProvider from "./contexts/ToastProvider";

// eslint-disable-next-line react-refresh/only-export-components
export const router = createBrowserRouter(routes);

export default function App() {
    return (
        <ToastProvider>
            <RouterProvider router={router} />
        </ToastProvider>
    );
}