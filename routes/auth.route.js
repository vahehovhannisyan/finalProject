const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const TokenController = require('../controllers/TokenController');
const { check } = require('express-validator');
const multer  = require('multer');
// const upload = multer({dest:'images/'});
const uuid = require('uuid').v4;

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
      cb(null, 'images/')
    },

    filename: function (req, file, cb) {
        const {originalname} = file
        cb(null, `${uuid()}-${originalname}`)
    }
  })
   
  const upload = multer({ storage: storage })

  router.get("/customers", (req, res) => {
    res.status(200).send("Customer results");
  })

router.post("/user", [
    check("firstName").not().isEmpty().withMessage('firstName must not be empty'),
    check("lastName").not().isEmpty().withMessage('lastName must not be empty'),
    check("email").not().isEmpty().withMessage('email must not be empty').isEmail().withMessage('email must be an email'), 
    check("password").not().isEmpty().withMessage('password must not be empty').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    ).withMessage({digit:'should contain at least one digit', upperCase:'should contain at least one upper case', lowerCase:'should contain at least one lower case', minLength:'should contain at least 8 from the mentioned characters'}),
    check("confirmPassword").not().isEmpty().withMessage('confirmPassword must not be empty') 
], AuthController.register);

router.post('/login', AuthController.login);
router.post('/upload', TokenController.authenticateToken, upload.single('my-file'), AuthController.upload )



module.exports = router;