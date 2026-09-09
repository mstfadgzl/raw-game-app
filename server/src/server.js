import http from 'node:http';

const port = Number(process.env.PORT || 3000);
const rawgApiKey = process.env.RAWG_API_KEY?.trim();
const rawgBaseUrl = process.env.RAWG_BASE_URL?.trim();
const requestTimeoutMs = 15_000;

if (!rawgApiKey || !rawgBaseUrl) {
  throw new Error(
    'RAWG_API_KEY ve RAWG_BASE_URL server/.env içinde tanımlanmalıdır.',
  );
}

const baseUrl = rawgBaseUrl.endsWith('/')
  ? rawgBaseUrl
  : `${rawgBaseUrl}/`;

const writeJson = (response, statusCode, payload) => {
  const body = JSON.stringify(payload);

  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  });

  response.end(body);
};

const getUpstreamUrl = requestUrl => {
  const incomingUrl = new URL(
    requestUrl,
    `http://localhost:${port}`,
  );

  if (!incomingUrl.pathname.startsWith('/api/')) {
    return null;
  }

  const rawgPath = incomingUrl.pathname.slice('/api/'.length);

  if (!rawgPath || rawgPath.includes('..')) {
    return null;
  }

  const upstreamUrl = new URL(rawgPath, baseUrl);

  incomingUrl.searchParams.forEach((value, key) => {
    // RAWG anahtarının istemciden geçirilmesine izin vermiyoruz.
    if (key !== 'key') {
      upstreamUrl.searchParams.append(key, value);
    }
  });

  upstreamUrl.searchParams.set('key', rawgApiKey);

  return upstreamUrl;
};

const server = http.createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method !== 'GET') {
    writeJson(response, 405, { message: 'Yalnızca GET istekleri destekleniyor.' });
    return;
  }

  const requestUrl = new URL(
    request.url || '/',
    `http://${request.headers.host || `localhost:${port}`}`,
  );

  if (requestUrl.pathname === '/health') {
    writeJson(response, 200, { status: 'ok' });
    return;
  }

  const upstreamUrl = getUpstreamUrl(request.url || '/');

  if (!upstreamUrl) {
    writeJson(response, 404, { message: 'Geçersiz API yolu.' });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    const body = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get('content-type') ||
      'application/json; charset=utf-8';

    response.writeHead(upstreamResponse.status, {
      'Content-Type': contentType,
      'Content-Length': Buffer.byteLength(body),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    });
    response.end(body);
  } catch (error) {
    const message = error?.name === 'AbortError'
      ? 'RAWG isteği zaman aşımına uğradı.'
      : 'RAWG servisine ulaşılamadı.';

    console.error('[RAWG proxy]', message);
    writeJson(response, 502, { message });
  } finally {
    clearTimeout(timeout);
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`RAWG proxy http://localhost:${port}`);
});
