import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await db.select('*').from('category');

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /forum/ ERROR: ${e}`);
    next(e);
  }
});

router.get('/:categoryId', async (req, res, next) => {
  try {
    const data = await db
      .select('post.*', 'users.username', 'users.photo_url')
      .from('post')
      .join('users', 'post.users_id', 'users.id')
      .where('category_id', req.params.categoryId)
      .orderBy('post.create_time', 'desc');

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /forum/${req.params.categoryId} ERROR: ${e}`);
    next(e);
  }
});

router.get('/post/:postId/comments', async (req, res, next) => {
  try {
    const data = await db
      .select('comment.*', 'users.username', 'users.photo_url')
      .from('post')
      .join('comment', 'post.id', 'comment.post_id')
      .join('users', 'comment.users_id', 'users.id')
      .where('post.id', req.params.postId)
      .orderBy('comment.create_time');

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /forum/post/${req.params.postId}/comments ERROR: ${e}`);
    next(e);
  }
});

router.get('/comment/:commentId/replies', async (req, res, next) => {
  try {
    const data = await db
      .select('reply.*', 'users.username', 'users.photo_url')
      .from('comment')
      .join('reply', 'comment.id', 'reply.comment_id')
      .join('users', 'reply.users_id', 'users.id')
      .where('comment.id', req.params.commentId)
      .orderBy('reply.create_time');

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /comment/${req.params.commentId}/replies ERROR: ${e}`);
    next(e);
  }
});

export default router;