import { FormEvent, useState } from "react";
import "./App.css";
import { CircomExample, getAddress } from "@blockhackers/protocol";
import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider();
const example = new CircomExample(
  provider,
  getAddress("chain-31337", "CircomExample")
);

function App() {
  const [status, setStatus] = useState<"init" | "error" | "success">("init");
  const [proof, setProof] = useState<string>("");
  const [provingTime, setProvingTime] = useState<number | undefined>();
  const [verifyingTime, setVerifyingTime] = useState<number | undefined>();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    setStatus("init");
    setProof("");
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const a = Number(data.get("a"));
    const b = Number(data.get("b"));
    const c = Number(data.get("c"));
    let time = new Date();
    const proof = await example.multiplierProve(a, b);
    setProvingTime(Number(new Date()) - Number(time));
    setProof(proof);
    time = new Date();
    try {
      await example.multiplierVerify(proof, c);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
    setVerifyingTime(Number(new Date()) - Number(time));
  }

  return (
    <div>
      <h2>Prove and Verify your zkSNARK</h2>
      <blockquote>a x b = c</blockquote>
      <form onSubmit={onSubmit}>
        <label htmlFor="a">
          a:
          <input type="number" name="a" />
        </label>
        <label>
          b:
          <input type="number" name="b" />
        </label>
        <label>
          c:
          <input type="number" name="c" />
        </label>
        {status === "init" && <button>Prove and verify</button>}
        {status === "error" && (
          <button>
            Try Again <span className="error">×</span>
          </button>
        )}
        {status === "success" && (
          <button>
            Proof is valid <span className="success">✓</span>
          </button>
        )}
        {provingTime !== undefined && <div>Proof took {provingTime}ms</div>}
        {verifyingTime !== undefined && (
          <div>Verification took {verifyingTime}ms</div>
        )}
      </form>
      {proof && <pre>{proof}</pre>}
    </div>
  );
}

export default App;
