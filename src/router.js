import express from 'express';
import igdb from './igdb.js';

const router = express.Router();

router.use(express.text());

router.post("/api/igdb/v4/games", igdb("games"));
router.post("/api/igdb/v4/query", igdb("query"));
router.post("/api/igdb/v4/platforms", igdb("platforms"));

export default router;
