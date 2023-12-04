const express = require('express');
const { initializeTransaction, verifyTransaction } = require('../controllers/transactionController');
const { protectUser } = require('../middlewares/authMiddleware');


const router = express.Router()


// TRANSACTIONS
router.post('/', protectUser, initializeTransaction);
router.get('/verify-payment', protectUser, verifyTransaction);




module.exports = router