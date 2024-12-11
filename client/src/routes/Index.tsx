import { useLogto } from "@logto/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTokenStore } from "../tokenStore";

export const Index = () => {
  const { signIn, signOut, isAuthenticated, getAccessToken } = useLogto();
  const setToken = useTokenStore((s) => s.setToken);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessToken("https://api.vvoo.link/").then((token) => {
        setToken(token ?? null);
        navigate("/app");
      });
    } else {
      setToken(null);
    }
  }, [isAuthenticated]);

  return isAuthenticated ? (
    <button onClick={() => signOut()}>Sign Out</button>
  ) : (
    <button onClick={() => signIn(`${window.location.origin}/callback`)}>
      Sign In
    </button>
  );
};
