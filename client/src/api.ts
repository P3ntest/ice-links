import axios from "axios";
import { useTokenStore } from "./tokenStore";

export const useApi = () => {
  const token = useTokenStore((s) => s.token);

  return axios.create({
    baseURL: "http://api.localhost:3000",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};
