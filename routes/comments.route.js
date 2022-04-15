const router = require('express').Router();
const CommentController = require('../controllers/CommentController');

router.get('/last5/:postId', CommentController.getComments);
router.get('/more/:postId', CommentController.showMoreComments);

router.post('/:postId', CommentController.createComment);

module.exports = router;