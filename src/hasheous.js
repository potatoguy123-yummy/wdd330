import { makeRequest } from "./utils.js";

const HASHEOUS_API_URL = 'https://hasheous.org/api/v1/Lookup/ByHash/sha1/';

export default function hashous() {
    return async (req, res) => {
        try {
            const sha1 = req.params.sha1;

            const options = {
                hostname: 'hasheous.org',
                path: `/api/v1/Lookup/ByHash/sha1/${sha1}`,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            const result = await makeRequest(options, "");

            res.json(result);
        } catch (error) {
            console.error('Error in hashous API:', error);
            if (error.statusCode) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json({
                    error: 'Internal server error',
                    message: error.message
                });
            }
        }
    };
}