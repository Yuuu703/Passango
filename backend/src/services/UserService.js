const User = require('../models/User');
const { validateEmail, validatePassword, comparePassword, generateToken } = require('../utils/helpers');
const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = promisify(cloudinary.uploader.upload);

class UserService {
    async createUser(userData) {
        if (!validateEmail(userData.email)) {
            throw new Error('Invalid email format');
        }

        if (!validatePassword(userData.password)) {
            throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
        }

        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        return await User.create(userData);
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = generateToken(user);
        return { user, token };
    }

    async getUserById(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateUser(id, userData) {
        const user = await this.getUserById(id);
        
        if (userData.email && userData.email !== user.email) {
            const existingUser = await User.findOne({ where: { email: userData.email } });
            if (existingUser) {
                throw new Error('Email already in use');
            }
        }

        return await user.update(userData);
    }

    async deleteUser(id) {
        const user = await this.getUserById(id);
        await user.destroy();
        return { message: 'User deleted successfully' };
    }

    async updateAvatar(userId, file) {
        try {
            // Upload image to Cloudinary
            const result = await uploadImage(file.path, {
                folder: 'passango/avatars',
                width: 500,
                height: 500,
                crop: 'fill',
                gravity: 'face'
            });

            // Update user's avatar URL
            const user = await User.findByIdAndUpdate(
                userId,
                { avatar: result.secure_url },
                { new: true, runValidators: true }
            );

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw new Error(`Failed to update avatar: ${error.message}`);
        }
    }
}

module.exports = new UserService(); 