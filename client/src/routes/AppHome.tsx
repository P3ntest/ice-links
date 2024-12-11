import { useState } from "react";
import { useApi } from "../api";

export function AppHome() {
  const api = useApi();

  return (
    <div>
      <Creator />
    </div>
  );
}

function Creator() {
  const [path, setPath] = useState("");
  const [target, setTarget] = useState("");
  const api = useApi();

  return (
    <div>
      <input
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="path"
      />
      <input
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="target"
      />
      <button
        onClick={() => {
          api.post("/link", { path, target });
        }}
      >
        Create
      </button>
    </div>
  );
}
