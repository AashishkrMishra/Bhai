import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HttpResponse,delay } from "msw";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function randomDelay() {
  return delay(200 + Math.random() * 1000); // 200–1200ms
}
export function maybeError() {
  if (Math.random() < 0.1) {
    throw HttpResponse.json({ error: "Random server error" }, { status: 500 });
  }
}