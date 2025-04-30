import { groth16 } from 'snarkjs';

export async function generateZKProof(input) {
  const wasmPath = '/proveVote.wasm';
  const zkeyPath = '/proveVote.zkey';

  const { proof, publicSignals } = await groth16.fullProve(
    input,
    wasmPath,
    zkeyPath
  );

  return { proof, publicSignals };
}
