import { createBrowserRouter } from "react-router-dom";
import Root from "../components/Root";
import SSLCOMERZ from "./../methods/SSLCOMERZ"

const router = createBrowserRouter([
  {
    path:"/",
    element:<Root />,
    children:[
      {
        path:"/sslcomerz",
        element:<SSLCOMERZ />
      }
    ]
  }
])

export default router;