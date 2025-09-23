export function saveState(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadState<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}
