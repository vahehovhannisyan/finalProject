const router = require('express').Router();
const FavouritePostController = require('../controllers/FavouritePostController');
const TokenController = require ('../controllers/TokenController');

router.get('/getAll', TokenController.authenticateToken, FavouritePostController.findAll);
router.get('/get', TokenController.authenticateToken, FavouritePostController.getPosts);
router.get('/search', TokenController.authenticateToken, FavouritePostController.searchPost);

router.post('/addToFavourites', TokenController.authenticateToken, FavouritePostController.addToFavourites);

router.delete('/remove', TokenController.authenticateToken, FavouritePostController.removeFromFavourites )

module.exports = router;