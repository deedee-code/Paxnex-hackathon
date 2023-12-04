const express = require('express');
const { customerAccount, createWallet } = require('../controllers/walletController');
const { protectUser } = require('../middlewares/authMiddleware');


const router = express.Router()


// CUSTOMER VIRTUAL WALLET
router.post('/create-account', protectUser, customerAccount)
router.post('/create-wallet', protectUser, createWallet);


module.exports = router