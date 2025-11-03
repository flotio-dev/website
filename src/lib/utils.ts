export default function clientApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Get token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`/api/proxy/${path}`, {
    ...options,
    headers,
  }).then((res) => {
    if (!res.ok) {
      return Promise.reject(new Error(`API request failed with status ${res.status}`));
    }
    return res.json() as Promise<T>;
  });
}
