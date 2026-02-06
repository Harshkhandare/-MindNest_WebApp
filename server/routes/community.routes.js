const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community.controller');
const authenticate = require('../middleware/auth.middleware');

// Allow viewing posts without authentication, but require auth for actions
router.post('/', authenticate, communityController.createPost);
// GET /community - Allow unauthenticated viewing, but my-posts filter requires auth
router.get('/', communityController.getPosts);
router.get('/:id', communityController.getPostById); // Allow unauthenticated viewing
router.post('/:id/like', authenticate, communityController.likePost);
router.post('/:id/comment', authenticate, communityController.addComment);
router.delete('/:id', authenticate, communityController.deletePost);

module.exports = router;

