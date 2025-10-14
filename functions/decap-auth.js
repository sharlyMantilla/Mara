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
  const state = params.get("state") || "";

  // Step 1: redirect to GitHub if no code yet
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

  // Step 2: exchange code for token
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

    const token = data.access_token;

    const html = `<!doctype html><html><body>
<script>(function(){
  var token = ${JSON.stringify(token)};
  var state = ${JSON.stringify(state)};
  var origin = ${JSON.stringify(origin)};
  var opener = (window.opener || window.parent);
  function sendAll(){
    try{opener.postMessage({ token: token, provider: 'github', state: state }, origin);}catch(e){}
    try{opener.postMessage({ token: token, provider: 'github', state: state }, '*');}catch(e){}
    try{opener.postMessage({ data: { token: token, provider: 'github', state: state } }, origin);}catch(e){}
    try{opener.postMessage({ data: { token: token, provider: 'github', state: state } }, '*');}catch(e){}
    try{opener.postMessage({ type: 'authorization_response', token: token, provider: 'github', state: state }, origin);}catch(e){}
    try{opener.postMessage({ type: 'authorization_response', token: token, provider: 'github', state: state }, '*');}catch(e){}
    try{opener.postMessage({ access_token: token, provider: 'github', state: state }, origin);}catch(e){}
    try{opener.postMessage({ access_token: token, provider: 'github', state: state }, '*');}catch(e){}
    try{opener.postMessage({ data: { access_token: token, provider: 'github', state: state } }, origin);}catch(e){}
    try{opener.postMessage({ data: { access_token: token, provider: 'github', state: state } }, '*');}catch(e){}
    try{opener.postMessage({ type: 'authorization_response', provider: 'github', state: state, data: { token: token, access_token: token } }, origin);}catch(e){}
    try{opener.postMessage({ type: 'authorization_response', provider: 'github', state: state, data: { token: token, access_token: token } }, '*');}catch(e){}
    try{opener.postMessage('authorization:github:success:' + token, origin);}catch(e){}
    try{opener.postMessage('authorization:github:success:' + token, '*');}catch(e){}
  }
  sendAll();
  var i=0; var iv = setInterval(function(){ try{sendAll();}catch(e){} if(++i>20){ clearInterval(iv); } }, 150);
  setTimeout(function(){ try{ window.close(); }catch(e){} }, 4000);
})();</script>
Authenticated. This window will close automatically...
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
      body: JSON.stringify({ error: "Internal error", details: String(err) }),
    };
  }
};