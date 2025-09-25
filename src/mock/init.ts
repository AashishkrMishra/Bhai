// mock/init.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { seed } from "./seed";
import { db } from "./db";

export async function startMocks() {
  await seed(); // seed local DB
  // await db.delete();
  const worker = setupWorker(...handlers);
  return worker.start({ onUnhandledRequest: "bypass" });
}