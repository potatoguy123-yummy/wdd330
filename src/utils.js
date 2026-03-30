import https from 'https';

let tokenStore = {
  value: null,
  expiry: 0
};

export function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          res.statusCode >= 200 && res.statusCode < 300 ? resolve(json) : reject(json);
        } catch (e) {
          reject('Error parsing response');
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

export async function getAccessToken() {
  const currentTime = Date.now();

  if (tokenStore.value && currentTime < tokenStore.expiry - 60000) {
    return tokenStore.value;
  }

  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'client_credentials'
  }).toString();

  const options = {
    hostname: 'id.twitch.tv',
    path: `/oauth2/token?${params}`,
    method: 'POST'
  };

  console.log('Token expired or missing. Re-authenticating with Twitch...');
  const response = await makeRequest(options);

  tokenStore.value = response.access_token;
  tokenStore.expiry = currentTime + (response.expires_in * 1000);

  return tokenStore.value;
}
