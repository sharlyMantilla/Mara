// functions/decap-auth.js
const allowOrigin = "*";

function siteOrigin(event) {
  const proto = event.headers["x-forwarded-proto"] || "https";
  const host = event.headers.host;
  return `${proto}://${host}`;
}

exports.handler = async function (event) {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  const origin = siteOrigin(event);
  const redirect_uri = `${origin}/.netlify/functions/decap-auth`;

  const params = new URLSearchParams(event.queryStringParameters || {});
  const code = params.get("code");

  // 1) Sin ?code -> redirige a GitHub (autorización)
  if (!code) {
    const authorize = new URL("https://github.com/login/oauth/authorize");
    authorize.searchParams.set("client_id", client_id);
    authorize.searchParams.set("redirect_uri", redirect_uri);
    // usa "public_repo" si tu repo es público; "repo" para privados
    authorize.searchParams.set("scope", "repo");

    return {
      statusCode: 302,
      headers: {
        Location: authorize.toString(),
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": allowOrigin,
      },
      body: "",
    };
  }

  // 2) Con ?code -> intercambia por access_token
  try {
    const resp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ client_id, client_secret, code, redirect_uri }),
    });

    const data = await resp.json();

    if (!data.access_token) {
      return {
        statusCode: 401,
        headers: { "Access-Control-Allow-Origin": allowOrigin },
        body: JSON.stringify({
          error: "No se recibió access_token desde GitHub",
          details: data,
        }),
      };
    }

    // HTML del popup: envía el token y espera un instante antes de cerrar
    const html = `<!doctype html>
<html><body>
<script>
  (function () {
    try {
      var token = ${JSON.stringify(data.access_token)};
      var msg = { token: token, provider: "github" };
      // 1) Intenta con el origin exacto
      try { (window.opener || window.parent).postMessage(msg, "${origin}"); } catch (e) {}
      // 2) Y también a cualquier origin (algunos builds de Decap lo esperan así)
      try { (window.opener || window.parent).postMessage(msg, "*"); } catch (e) {}

      // Espera ~800ms para asegurar entrega y procesamiento
      setTimeout(function () {
        window.close();
      }, 800);
    } catch (e) {
      document.body.innerHTML = "Error al enviar token: " + String(e);
    }
  })();
</script>
Autenticación completada. Esta ventana se cerrará automáticamente…
</body></html>`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": allowOrigin,
        "Cache-Control": "no-store",
      },
      body: html,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": allowOrigin },
      body: JSON.stringify({
        error: "Error interno en decap-auth",
        details: String(err),
      }),
    };
  }
};
