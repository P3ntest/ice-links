import { createBrowserRouter } from "react-router-dom";
import { Index } from "./routes/Index";
import Callback from "./routes/Callback";
import { AppShell } from "./routes/AppShell";
import { AppHome } from "./routes/AppHome";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
  {
    path: "/app",
    element: <AppShell />,
    children: [
      {
        path: "",
        element: <AppHome />,
      },
    ],
  },
]);
