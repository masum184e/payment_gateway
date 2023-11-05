import { createBrowserRouter } from "react-router-dom";
import Root from "../components/Root";
import SSLCOMERZ from "./../methods/SSLCOMERZ"
import StripeCheckout from "../methods/StripeCheckout";

const router = createBrowserRouter([
  {
    path:"/",
    element:<Root />,
    children:[
      {
        path:"/sslcomerz",
        element:<SSLCOMERZ />
      },{
        path:"/stripe-checkout",
        element:<StripeCheckout />
      }
    ]
  }
])

export default router;