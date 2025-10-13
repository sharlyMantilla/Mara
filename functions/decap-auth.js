// functions/decap-auth.js
// Flujo completo para Decap CMS con backend GitHub:
// - Sin ?code: redirige a GitHub (autorización)
// - Con ?code: intercambia por access_token y se lo entrega al CMS

const allowOrigin = '*';

function siteOrigin(event) {
  // construye https://<tu-dominio>
  const proto = event.headers['x-forwarded-proto'] || 'https';
  const host = event.headers.host;
  return `${proto}://${host}`;
}

exports.handler = async function (event) {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  const origin = siteOrigin(event);
  const redirect_uri = `${origin}/.netlify/functions/decap-auth`;

  const params = new URLSearchParams(event.queryStringParameters || {});
  const code = params.get('code');

  // 1) Si NO hay code, redirigimos a GitHub para que el usuario autorice
  if (!code) {
    const authorize = new URL('https://github.com/login/oauth/authorize');
    authorize.searchParams.set('client_id', client_id);
    authorize.searchParams.set('redirect_uri', redirect_uri);
    // scope "repo" para repos privados; si tu repo es público puedes usar "public_repo"
    authorize.searchParams.set('scope', 'repo');
    // opcional: state
    // authorize.searchParams.set('state', 'xyz');

    return {
      statusCode: 302,
      headers: {
        Location: authorize.toString(),
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': allowOrigin,
      },
      body: '',
    };
  }

  // 2) Con code: intercambiamos por access_token
  try {
    const resp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ client_id, client_secret, code, redirect_uri }),
    });

    const data = await resp.json();

    if (!data.access_token) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': allowOrigin },
        body: JSON.stringify({ error: 'No se recibió access_token desde GitHub', details: data }),
      };
    }

    // Entregamos el token al CMS usando postMessage y cerramos el popup
    const html = `<!doctype html>
<html><body>
<script>
  (window.opener || window.parent).postMessage(
    { token: ${JSON.stringify(data.access_token)} },
    "*"
  );
  window.close();
</script>
Autenticación completada. Puedes cerrar esta ventana.
</body></html>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': allowOrigin,
      },
      body: html,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': allowOrigin },
      body: JSON.stringify({ error: 'Error interno en decap-auth', details: String(err) }),
    };
  }
};
