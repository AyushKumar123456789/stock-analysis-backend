const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SendMail } = require('../util/nodemailer/EmailValidation');
const { SendForgotPasswordMail } = require('../util/nodemailer/forgotPassword');
const {
    RequiredTokenError,
    UserAlreadyExistsError,
    InvalidCredentialsError,
    UserNotFoundError,
} = require('../error');

const emailVerificationRedirect =
    process.env.CLIENT_URL || 'http://localhost:5173/login';

exports.registerByMail = async (req, res, next) => {
    try {
        const registerToken = req.query.token;
        if (!registerToken) {
            throw new RequiredTokenError();
        }

        const registerTokenPayload = jwt.verify(
            registerToken,
            process.env.JWT_SECRET
        );
        const { username, email, password } = registerTokenPayload;

        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new UserAlreadyExistsError();
        }

        const user = new User({ username, password, email });
        await user.save();

        const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.cookie('token', authToken, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 3600000, // 1 hour
        });
        res.cookie('role', user.role, {
            sameSite: 'Strict',
            maxAge: 3600000, // 1 hour
        });

        res.redirect(emailVerificationRedirect);
    } catch (err) {
        next(err);
    }
};

// Register user by sending a verification email
exports.register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new UserAlreadyExistsError();
        }

        const registerToken = jwt.sign(
            { username, email, password },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const mailOptions = {
            username,
            email,
            message: registerToken,
        };
        await SendMail(mailOptions);

        res.status(200).json({
            message: 'Verification email sent successfully',
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('password');
        if (!user) {
            throw new InvalidCredentialsError();
        }

        const passwordCompareResult = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCompareResult) {
            throw new InvalidCredentialsError();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 3600000, //1 hour
        });
        res.cookie('role', user.role, {
            sameSite: true,
            maxAge: 3600000, //1 hour
        });
        res.json({ message: 'User logged in successfully' });
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.clearCookie('role');
        res.json({ message: 'Logged out' });
    } catch (err) {
        next(err);
    }
};

exports.isLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(false);
        }
        jwt.verify(token, process.env.JWT_SECRET);
        res.json(true);
    } catch (err) {
        next(err);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new UserNotFoundError();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });
        const mailOptions = {
            username: user.username,
            email,
            message: token,
        };
        await SendForgotPasswordMail(mailOptions);

        res.json({
            message: 'Password reset email sent successfully',
        });
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;

        const token = req.query.token;
        if (!token) {
            throw new RequiredTokenError();
        }

        const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = tokenPayload;

        const user = await User.findById(id);
        if (!user) {
            throw new UserNotFoundError();
        }

        user.password = password;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        next(err);
    }
};

exports.me = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = await User.findById(currentUserId);

        res.json(currentUser);
    } catch {
        next(err);
    }
};
