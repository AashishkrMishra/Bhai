// storage.ts

// Save to localStorage
export function saveState(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Load from localStorage
export function loadState<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function removeState(key: string) {
  localStorage.removeItem(key);
}