import express from 'express';
import db from '../Database/index.js';

const router = express.Router();
// routes:
router.get('/', async (req, res, next) => {
  try {
    const data = await db.select('*').from('faqs').whereNot('answer', null);
    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /faq ERROR: ${e}`);
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = await db('faqs').insert({
      question: req.body.question,
      answer: null,
      asked_by: req.body.userId,
      answered_by: null,
    });
    res.status(200).json(data);
  } catch (e) {
    console.error(`POST /faq ERROR: ${e}`);
    next(e);
  }
});

router.patch('/:faqId', async (req, res, next) => {
  try {
    const data = await db.select('*').from('faqs').where('id', req.params.faqId).update({
      question: req.body.question,
      answer: req.body.answer,
      asked_by: req.body.userId,
      answered_by: req.body.answered_by,
    });
    res.status(200).json(data);
  } catch (e) {
    console.error(`PATCH /faq/:faqId ERROR: ${e}`);
    next(e);
  }
});

router.get('/new', async (req, res, next) => {
  try {
    const data = await db.select('*').from('faqs').where('answer', null);
    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /faq/new ERROR: ${e}`);
    next(e);
  }
});

router.delete('/:faqId', async (req, res, next) => {
  try {
    const data = await db.select('*').from('faqs').where('id', req.params.faqId).del();
    res.status(200).json(data);
  } catch (e) {
    console.error(`DELETE /faq/:faqId ERROR: ${e}`);
    next(e);
  }
});

export default router;
