const express = require('express');
const { protectUser } = require('../middlewares/authMiddleware');
const { registerEmail, verifyEmail, userInfo, userLogin, forgetPassword, resetPassword, setupPin } = require('../controllers/authController');

const router = express.Router()


// AUTH
router.post('/signup', registerEmail);
router.post('/verify-account', verifyEmail);
router.post('/', protectUser, userInfo);
router.post('/login', userLogin);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);
router.post('/set-pin', protectUser, setupPin);


module.exports = router