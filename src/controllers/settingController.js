const User = require('../models/authModel');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


const editProfile = async (req, res) => {
    const userId = req.params.id
    const { address, state, country, phoneNumber } = req.body

    const currentUser = await User.findById(userId)
    if (!currentUser) {
        return res.status(400).json({ message: "Invalid User ID!" })
    }

    currentUser.address = address;
    currentUser.state = state;
    currentUser.country = country;
    currentUser.phoneNumber = phoneNumber;

    await currentUser.save()

    const user = { ...currentUser._doc }
    delete user.password
    delete user.pin

    return res.status(200).json({ message: "User Profile Updated Successfully", status: 200, success: true, data: { user } })
}


const uploadPicture = async (req, res) => {
    const userId = req.params.id
    const profilePicture = req.file;

    try {
        const currentUser = await User.findById(userId)
        if (!currentUser) {
            return res.status(400).json({ message: "Invalid User ID!" })
        }

        currentUser.profilePicture = profilePicture.path

        await currentUser.save()

        const user = { ...currentUser._doc }
        delete user.password
        delete user.pin

        return res.status(200).json({ message: "Profile picture updated successfully!", status: 200, success: true, data: { user } });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error!" })
    }
}


const deletePicture = async (req, res) => {
    const userId = req.params.id;

    try {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(400).json({ message: "Invalid User ID!" });
        }

        // Check if the user has a profile picture
        if (!currentUser.profilePicture) {
            return res.status(400).json({ message: "User does not have a profile picture!" });
        }

        // Delete the profile picture
        currentUser.profilePicture = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";
        await currentUser.save();

        const user = { ...currentUser._doc }
        delete user.password
        delete user.pin

        return res.status(200).json({ message: "Profile picture deleted successfully!", status: 200, success: true, data: { user } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const changePassword = async (req, res) => {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required!" })
    }

    const user = await User.findById(userId)
    if (!user) {
        return res.status(400).json({ message: "Invalid User ID!" })
    }


    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect current password" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword

    await user.save()

    const currentUser = { ...user._doc }
    delete currentUser.password
    delete currentUser.pin

    return res.status(200).json({ message: "Password changed Successfully", status: 200, success: true, data: { currentUser } })
}



const changePin = async (req, res) => {
    const userId = req.params.id
    const { pin, newPin } = req.body

    const user = await User.findById(userId)
    if (!user) {
        return res.status(400).json({ message: "Invalid User ID!" })
    }

    const isPinCorrect = await bcrypt.compare(pin, user.pin);
    if (!isPinCorrect) {
        return res.status(401).json({ message: 'Invalid current PIN' });
    }

    const hashedPin = await bcrypt.hash(newPin, 10);

    user.pin = hashedPin;

    await user.save();

    const currentUser = { ...user._doc }
    delete currentUser.pin
    delete currentUser.password

    // Return success message
    return res.status(200).json({ message: "PIN changed successfully", status: 200, success: true, data: { currentUser } })
}



const deleteProfile = async (req, res) => {
    const userId = req.params.id

    const user = await User.findById(userId)
    if (!user) {
        return res.status(400).json({ message: "Invalid User ID!" })
    }

    await user.deleteOne()

    return res.status(200).json({ message: "User deleted Successfully", status: 200, success: true })
}



exports.editProfile = editProfile;
exports.uploadPicture = uploadPicture;
exports.deletePicture = deletePicture;
exports.changePassword = changePassword;
exports.changePin = changePin;
exports.deleteProfile = deleteProfile;
exports.upload = upload;
