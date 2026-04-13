import express from 'express';
import igdb from './igdb.js';
import hashous from './hasheous.js';

const router = express.Router();

router.use(express.text());

router.post("/api/igdb/v4/games", igdb("games"));
router.post("/api/igdb/v4/query", igdb("query"));
router.post("/api/igdb/v4/platforms", igdb("platforms"));
router.get("/api/hasheous/api/v1/Lookup/ByHash/sha1/:sha1", hashous());

export default router;
