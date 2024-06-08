import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import Reservation from "../pages/Reservation/Reservation";
import NotFound from "../pages/NotFound/NotFound";
import CustomerInvoice from "../pages/CustomerInvoice/CustomerInvoice";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/reservation",
                element: <Reservation />
            },
            {
                path: '/invoice',
                element: <CustomerInvoice />
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    }
]);

export default router;