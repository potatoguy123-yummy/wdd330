import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import router from './src/router.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT?.toLowerCase() || 3000;
const HOST = process.env.HOST?.toLowerCase() || "0.0.0.0";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    if (NODE_ENV === "development") {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

app.use(router);

app.listen(PORT, HOST, async () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});
