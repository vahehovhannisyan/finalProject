const router = require('express').Router();

const TokenController = require('../controllers/TokenController');

const postRouter = require('./posts.route');
const favouritePostRouter = require('./favouritePosts.route');
const commentsRouter = require('./comments.route');
const authRouter = require('./auth.route');


router.use('/post', TokenController.authenticateToken, postRouter);
router.use('/favouritePost', favouritePostRouter);
router.use('/comment', commentsRouter );
router.use('/auth', authRouter );



module.exports = router;