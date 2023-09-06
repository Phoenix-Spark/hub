import express from 'express';
// import db from '../Database/index.js';
import exportDataToJson from '../Database/JsonDB/exportDataToJson.js';

const router = express.Router();

router.post('/generateJSON', async (req, res, next) => {
  try {
    const { table } = req.body;
    await exportDataToJson(table);
    res.json({ message: 'Export executed successfully' });
  } catch (e) {
    console.error(`Fuck: ${e}`);
    next(e);
  }
});

export default router;
