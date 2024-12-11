import { useLogto } from "@logto/react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useTokenStore } from "../tokenStore";
import { useApi } from "../api";

export function AppShell() {
  const { signOut, isAuthenticated } = useLogto();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/");
  }

  const tokenStore = useTokenStore();
  const api = useApi();

  useEffect(() => {
    api.get("/auth").catch(() => {
      tokenStore.setToken(null);
      console.log("token probably expired");
      navigate("/");
    });
  }, [tokenStore.token]);

  return (
    <div>
      AppShell
      <button onClick={() => signOut()}>Sign Out</button>
      <Outlet />
    </div>
  );
}
