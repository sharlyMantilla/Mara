// functions/decap-auth.js
// Esta función intercambia el código OAuth por un access token de GitHub.
// Compatible con runtime Node 18 (Netlify Functions)

const allowOrigin = '*';

exports.handler = async function (event, context) {
  // Respuesta a solicitudes OPTIONS (preflight CORS)
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

  const code = event.queryStringParameters.code;
  if (!code) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': allowOrigin },
      body: JSON.stringify({ error: 'Falta el parámetro ?code' }),
    };
  }

  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ client_id, client_secret, code }),
    });

    const data = await response.json();

    if (!data.access_token) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': allowOrigin },
        body: JSON.stringify({
          error: 'No se recibió access_token desde GitHub',
          details: data,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowOrigin,
      },
      body: JSON.stringify({ token: data.access_token }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': allowOrigin },
      body: JSON.stringify({
        error: 'Error interno en decap-auth',
        details: String(err),
      }),
    };
  }
};
