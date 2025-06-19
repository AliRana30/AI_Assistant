const express = require('express');
const router = express.Router();
const login = require('../controllers/login');
const signup = require('../controllers/signup');
const auth = require('../middlewares/auth');
const updateAssistant  = require('../controllers/user.controller');
const upload = require('../middlewares/multer')
const logout = require('../controllers/logout');
const {currentUser} = require('../controllers/currentuser');
const assistant = require('../controllers/Assistant');

router.get('/dashboard', auth, (req, res) => {
  res.json({ message: `Welcome, ${req.user.name}. This is a protected route.` });
});

router.route('/login').post(login);
router.route('/logout').get(logout);
router.get('/current-user', currentUser);


// router.get("/login",auth,login);
router.post('/assistant',auth,assistant);

router.post('/update',auth,upload.single("assitantImage"),updateAssistant)
router.route("/signup").post(signup);
router.route('/signup').get(signup);

module.exports = router;