import express from 'express';
import exportDataToJson from '../Services/TableExportService.js';

const router = express.Router();

router.post('/generateJSON', async (req, res, next) => {
  try {
    const { table } = req.body;
    await exportDataToJson(table);
    res.json({ message: 'Export executed successfully' });
  } catch (e) {
    console.error(`Error: ${e}`);
    next(e);
  }
});

export default router;
