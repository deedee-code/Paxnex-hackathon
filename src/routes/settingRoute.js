const express = require('express');
const { editProfile, deleteProfile, changePassword, changePin, upload, uploadPicture, deletePicture } = require('../controllers/settingController');
const { protectUser } = require('../middlewares/authMiddleware');

const router = express.Router()


// EDIT
router.put('/:id/edit', protectUser, editProfile);
router.post('/:id/upload-picture', protectUser, upload.single('profilePicture'), uploadPicture)
router.delete('/:id/delete-picture', protectUser, deletePicture)
router.put('/:id/change-password', protectUser, changePassword);
router.put('/:id/change-pin', protectUser, changePin);
router.delete('/:id', protectUser, deleteProfile);


module.exports = router