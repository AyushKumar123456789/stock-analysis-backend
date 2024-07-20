const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_DEFAULT_ROLE, USER_ROLES } = require('../util/constants');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            default: 'Newuser',
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false,
        },
        email: { type: String, required: true, unique: true },
        role: {
            type: String,
            enum: USER_ROLES,
            default: USER_DEFAULT_ROLE,
        },
    },
    { timestamps: true }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
