// mock/init.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { seed, db } from "./db";

export async function startMocks() {
  await seed(); 
  // await db.delete();
  const worker = setupWorker(...handlers);
  return worker.start({ onUnhandledRequest: "bypass" });
}
