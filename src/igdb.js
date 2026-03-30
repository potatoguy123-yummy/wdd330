import { getAccessToken, makeRequest } from "./utils.js"

const igdb = (endpoint) => {
  return async (req, res) => {
    try {
      const token = await getAccessToken();

      const query = typeof req.body === 'string' ? req.body : "";

      const options = {
        hostname: 'api.igdb.com',
        path: `/v4/${endpoint}`,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': process.env.CLIENT_ID,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(query)
        }
      };

      const result = await makeRequest(options, query);

      return res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Authentication Failed', details: error.message });
    }
  };
};

export default igdb;