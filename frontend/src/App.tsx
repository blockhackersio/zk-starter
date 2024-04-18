import { FormEvent, useState } from "react";
import "./App.css";
import { CircomExample, getAddress } from "@blockhackers/protocol";
import { JsonRpcProvider } from "ethers";
const provider = new JsonRpcProvider();
function App() {
  const [status, setStatus] = useState<"init" | "error" | "success">("init");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    setStatus("init");
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const a = Number(data.get("a"));
    const b = Number(data.get("b"));
    const c = Number(data.get("c"));
    console.log({ a, b, c });
    const example = new CircomExample(
      provider,
      getAddress("chain-31337", "CircomExample")
    );
    const proof = await example.multiplierProve(a, b);
    try {
      await example.multiplierVerify(proof, c);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <label>a: </label>
        <input name="a" />
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <label>b: </label>
        <input name="b" />
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <label>c: </label>
        <input name="c" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button>Prove and verify</button>
        {status === "error" && <div style={{ color: "red" }}>×</div>}
        {status === "success" && <div style={{ color: "green" }}>✓</div>}
      </div>
    </form>
  );
}

export default App;
