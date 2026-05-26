import fs from "node:fs";
import path from "node:path";

const nextDir = path.join(process.cwd(), ".next");

try {
  fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 300 });
  console.log("Next cache cleaned: .next");
} catch (error) {
  console.error("No se pudo eliminar .next.");
  console.error("Probablemente hay un proceso node/next bloqueando .next\\trace.");
  console.error("Cerra servidores dev/build activos o ejecuta:");
  console.error("  taskkill /F /IM node.exe");
  console.error("Luego reintenta:");
  console.error("  npm run clean");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
