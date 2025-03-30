import { withWealthboxClient } from "../middleware/withWeathboxClient";
import express from "express"
const router = express.Router();
router.get('/', withWealthboxClient, async (req, res) => {
    try {
      const client = (req as any).wealthboxClient;
      const { data } = await client.get('/users');
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  export default router