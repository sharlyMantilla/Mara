// functions/decap-auth.js
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
  const state = params.get("state");

  if (!code) {
    const authorize = new URL("https://github.com/login/oauth/authorize");
    authorize.searchParams.set("client_id", client_id);
    authorize.searchParams.set("redirect_uri", redirect_uri);
    authorize.searchParams.set("scope", "repo");
    if (state) authorize.searchParams.set("state", state);
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

  try {
    const resp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id, client_secret, code, redirect_uri }),
    });
    const data = await resp.json();

    if (!data.access_token) {
      return {
        statusCode: 401,
        headers: { "Access-Control-Allow-Origin": allowOrigin },
        body: JSON.stringify({ error: "No access_token", details: data }),
      };
    }

    const html = `<!doctype html>
<html><body>
<script>
  (function() {
    var token = ;
    var state = ;
    var provider = 'github';
    var opener = (window.opener || window.parent);

    // Formato 1 (Decap moderno):
    try { opener.postMessage({ token: token, provider: "github", state: state }, "${origin}"); } catch(e) {}
    try { opener.postMessage({ token: token, provider: "github", state: state }, "*"); } catch(e) {}

    // Formato 2 (algunas variantes esperan 'data' anidado):
    try { opener.postMessage({ data: { token: token, provider: "github", state: state } }, "${origin}"); } catch(e) {}
    try { opener.postMessage({ data: { token: token, provider: "github", state: state } }, "*"); } catch(e) {}

    // Formato 3 (muy antiguo: type)
    try { opener.postMessage({ type: "authorization_response", token: token, provider: "github", state: state }, "${origin}"); } catch(e) {}
    try { opener.postMessage({ type: "authorization_response", token: token, provider: "github", state: state }, "*"); } catch(e) {}

    // Formato 4: variantes con access_token
    try { opener.postMessage({ access_token: token, provider: "github", state: state }, "${origin}"); } catch(e) {}
    try { opener.postMessage({ access_token: token, provider: "github", state: state }, "*"); } catch(e) {}
    try { opener.postMessage({ data: { access_token: token, provider: "github", state: state } }, "${origin}"); } catch(e) {}
    try { opener.postMessage({ data: { access_token: token, provider: "github", state: state } }, "*"); } catch(e) {}
    try { opener.postMessage({ type: "authorization_response", provider: "github", state: state, data: { token: token, access_token: token } }, "${origin}"); } catch(e) {}
    try { opener.postMessage({ type: "authorization_response", provider: "github", state: state, data: { token: token, access_token: token } }, "*"); } catch(e) {}
    // Espera 1500ms para dar tiempo al CMS a guardar el token
    // Formato 5 (muy legacy: string simple)
    try { opener.postMessage("authorization:github:success:" + token, "${origin}"); } catch(e) {}
    try { opener.postMessage("authorization:github:success:" + token, "*"); } catch(e) {}
    setTimeout(function(){ window.close(); }, 3000);
  })();
</script>
Autenticado. Esta ventana se cerrarÃ¡ automÃ¡ticamenteâ€¦
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
      body: JSON.stringify({ error: "Error interno", details: String(err) }),
    };
  }
};