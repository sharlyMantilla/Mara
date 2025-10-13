// functions/decap-auth.js
// Flujo OAuth completo para Decap CMS (backend: github)

const allowOrigin = "*";

function siteOrigin(event) {
  const proto = event.headers["x-forwarded-proto"] || "https";
  const host = event.headers.host;
  return `${proto}://${host}`;
}

exports.handler = async function (event) {
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
    // usa "public_repo" si tu repo es público; "repo" da acceso también a privados
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

    // HTML para el popup: enviar token al opener con el formato que Decap espera
    const html = `<!doctype html>
<html><body>
<script>
  try {
    var token = ${JSON.stringify(data.access_token)};
    // Decap espera un postMessage con { token, provider: "github" }
    (window.opener || window.parent).postMessage(
      { token: token, provider: "github" },
      "${origin}"
    );
  } catch (e) {}
  window.close();
</script>
Autenticación completada. Puedes cerrar esta ventana.
</body></html>`;

    // Si pidieran JSON directamente (fallback):
    if ((event.headers.accept || "").includes("application/json")) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({ token: data.access_token, provider: "github" }),
      };
    }

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
