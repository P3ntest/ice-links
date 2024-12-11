import { LogtoProvider } from "@logto/react";
import { logtoConfig } from "./logto";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export function App() {
  return (
    <LogtoProvider config={logtoConfig}>
      <RouterProvider router={router} />
    </LogtoProvider>
  );
}
