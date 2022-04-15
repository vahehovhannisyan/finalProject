const router = require('express').Router();
const PostController = require('../controllers/PostController');

router.get('/post/last10', PostController.getPosts);
router.get('/post/more', PostController.showMorePosts);
router.get("/post/search", PostController.searchPost);

router.post('/post', PostController.createPost);

router.put('/post/:id', PostController.updatePost);
router.delete('/post/:id', PostController.deletePost);


module.exports = router;