const DEFAULT_SUPABASE_FETCH_TIMEOUT_MS = 5_000

/**
 * Supabase 请求超时时间。外部数据源异常时，页面应该快速降级而不是一直卡住。
 */
export const SUPABASE_FETCH_TIMEOUT_MS =
  Number(process.env.SUPABASE_FETCH_TIMEOUT_MS) || DEFAULT_SUPABASE_FETCH_TIMEOUT_MS

export const fetchWithTimeout: typeof fetch = async (input, init) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), SUPABASE_FETCH_TIMEOUT_MS)
  const upstreamSignal = init?.signal

  if (upstreamSignal?.aborted) {
    controller.abort(upstreamSignal.reason)
  } else {
    upstreamSignal?.addEventListener('abort', () => controller.abort(upstreamSignal.reason), {
      once: true,
    })
  }

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

export const supabaseGlobalOptions = {
  fetch: fetchWithTimeout,
}
