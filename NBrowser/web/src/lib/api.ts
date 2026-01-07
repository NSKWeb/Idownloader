export class ApiError extends Error {
  code?: string
  details?: unknown

  constructor(message: string, { code, details }: { code?: string; details?: unknown } = {}) {
    super(message)
    this.code = code
    this.details = details
  }
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL

export async function apiRequest<T>(
  path: string,
  {
    method = 'GET',
    body,
    token,
  }: { method?: string; body?: unknown; token?: string } = {}
): Promise<T> {
  if (!baseUrl) throw new Error('Missing NEXT_PUBLIC_API_URL')

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = (await res.json().catch(() => null)) as
    | { data?: T; error?: { message: string; code?: string; details?: unknown } }
    | null

  if (!res.ok) {
    const msg = json?.error?.message ?? `Request failed (${res.status})`
    throw new ApiError(msg, { code: json?.error?.code, details: json?.error?.details })
  }

  return (json?.data ?? ({} as T))
}
