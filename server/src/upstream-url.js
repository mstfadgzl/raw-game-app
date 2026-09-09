const API_PREFIX = '/api/';

function hasUnsafePathSegment(pathname) {
  return /(?:^|\/)(?:\.{1,2})(?:\/|$)/.test(pathname)
    || /(?:^|\/)(?:(?:%2e){1,2})(?:\/|$)/i.test(pathname);
}

export function getUpstreamUrl(requestUrl, {
  baseUrl,
  apiKey,
  port = 3000,
}) {
  if (!baseUrl || !apiKey) return null;

  let incomingUrl;
  let configuredBase;
  try {
    const rawRequestPath = String(requestUrl).split(/[?#]/, 1)[0];
    if (hasUnsafePathSegment(rawRequestPath) || rawRequestPath.includes('\\')) return null;
    incomingUrl = new URL(requestUrl, `http://localhost:${port}`);
    configuredBase = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  } catch {
    return null;
  }

  if (!['http:', 'https:'].includes(configuredBase.protocol)) return null;
  if (!incomingUrl.pathname.startsWith(API_PREFIX)) return null;

  const rawgPath = incomingUrl.pathname.slice(API_PREFIX.length);
  if (!rawgPath || rawgPath.startsWith('/') || rawgPath.includes('\\')
    || rawgPath.includes('://') || hasUnsafePathSegment(rawgPath)) {
    return null;
  }

  let upstreamUrl;
  try {
    upstreamUrl = new URL(rawgPath, configuredBase);
  } catch {
    return null;
  }

  // A relative RAWG path must never escape the configured origin.
  if (upstreamUrl.origin !== configuredBase.origin) return null;

  incomingUrl.searchParams.forEach((value, key) => {
    if (key.toLowerCase() !== 'key') upstreamUrl.searchParams.append(key, value);
  });
  upstreamUrl.searchParams.set('key', apiKey);
  return upstreamUrl;
}

function redactString(value) {
  if (!/^https?:\/\//i.test(value)) return value;
  try {
    const url = new URL(value);
    url.searchParams.delete('key');
    return url.toString();
  } catch {
    return value;
  }
}

export function redactApiKeys(value) {
  if (typeof value === 'string') return redactString(value);
  if (Array.isArray(value)) return value.map(redactApiKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, redactApiKeys(item)]));
  }
  return value;
}
