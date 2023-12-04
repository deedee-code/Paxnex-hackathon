const User = require('../models/authModel');
const OTPCode = require('../models/otpModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const moment = require('moment');



const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASS
    },
})


transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log('Ready for messages');
        console.log(success);
    }
});



const registerEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email field is required!" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ message: "User exist, Proceed to the Login Page!" })
    }

    const user = new User({
        email
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

    await user.save()

    try {
        const verifyCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const expiration = moment().add(1, 'hour').toDate();

        const otpCode = new OTPCode({
            email,
            otpCode: verifyCode,
            expiresAt: expiration,
        })

        await otpCode.save()

        const mailOptions = {
            from: process.env.GOOGLE_USER,
            to: email,
            subject: "Verify Signup Code",
            html: `<p>Your signup verification code is: <b>${verifyCode}</b>.</P>`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
                next()
            }
        });

        return res.status(200).json({ message: "An OTP Code has been sent to your email address!", status: 200, success: true, data: { user, token } })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}


const verifyEmail = async (req, res) => {
    const { email, otpCode } = req.body

    try {
        const user = await OTPCode.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.otpCode !== otpCode) {
            return res.status(400).json({ message: "Invalid recovery code" });
        }

        const currentTime = moment();
        if (user.expiresAt < currentTime) {
            return res.status(400).json({ message: "OTP code has expired" });
        }


        await user.save()


        return res.status(200).json({ message: "OTP code verified successfully", status: 200, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}


const userInfo = async (req, res) => {
    const { firstName, lastName, nationality, dateOfBirth, phoneNumber, country, state, address, tag, bvn, password } = req.body

    if (!firstName || !lastName || !nationality || !dateOfBirth || !phoneNumber || !country || !state || !address || !bvn || !password || !tag) {
        return res.status(400).json({ message: "All compulsory fields are compulsory!" })
    }

    const existingUser = await User.findOne({ email: req.user.email })

    if (!existingUser) {
        return res.status(400).json({ message: "User does not exist" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.nationality = nationality;
    existingUser.dateOfBirth = dateOfBirth;
    existingUser.phoneNumber = phoneNumber;
    existingUser.country = country;
    existingUser.state = state;
    existingUser.address = address;
    existingUser.tag = tag;
    existingUser.bvn = bvn;
    existingUser.password = hashedPassword


    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    await existingUser.save()

    const user = { ...existingUser._doc }
    delete user.password

    return res.status(200).json({ message: "User Successfully Signup Up", status: 200, success: true, data: { user, token }, })
}


const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required!" })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist, Proceed to the Signup Page!" })
        }

        const comparePassword = await bcrypt.compare(password, existingUser.password)
        if (!comparePassword) {
            return res.status(400).json({ message: "Invalid Email/Password" })
        }


        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        const user = { ...existingUser._doc }
        delete user.password
        delete user.pin

        return res.status(200).json({ message: "User Successfully Logged In...", status: 200, success: true, data: { user, token } })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}



const forgetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email field is required!" })
    }

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "User does not exist, proceed to the signup page!" })
    }

    const verifyCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const expiration = moment().add(1, 'hour').toDate();

    const otpCode = new OTPCode({
        email,
        otpCode: verifyCode,
        expiresAt: expiration,
    })

    await otpCode.save()

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to: email,
        subject: "Reset Password Code",
        html: `<p>Your reset password code is: <b>${verifyCode}</b>.</P>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
            next()
        }
    });

    return res.status(200).json({ message: "An OTP Code has been sent to your email address!", status: 200, success: true })
}



const resetPassword = async (req, res) => {
    const { otpCode, password } = req.body

    try {
        const passwordReset = await OTPCode.findOne({
            otpCode,
            expiresAt: { $gt: new Date() },
        })

        if (!passwordReset) {
            return res.status(500).json({ message: "Invalid or expired recovery code" })
        }

        const existingUser = await User.findOne({ email: passwordReset.email });

        if (!existingUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (password === existingUser.password) {
            return res.status(400).json({ message: 'New password must be different from the old password' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();

        const user = { ...existingUser._doc };
        delete user.password;

        return res.status(200).json({ message: 'Password reset successful and user logged in', data: user, status: 200, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}


const setupPin = async (req, res) => {
    const userId = req.user._id
    const { pin, confirmPin } = req.body

    if (!pin || pin.length < 4) {
        return res.status(400).json({ message: "Invalid Pin" })
    }

    const hashedPin = await bcrypt.hash(pin, 10);
    const userPin = await User.findByIdAndUpdate(userId, { pin: hashedPin });

    const user = { ...userPin._doc }
    delete user.pin
    delete user.password


    res.status(200).json({ message: 'PIN setup successful', status: 200, success: true, data: { user } });
}



exports.registerEmail = registerEmail;
exports.verifyEmail = verifyEmail;
exports.userLogin = userLogin;
exports.userInfo = userInfo;
exports.forgetPassword = forgetPassword;
exports.resetPassword = resetPassword;
exports.setupPin = setupPin;