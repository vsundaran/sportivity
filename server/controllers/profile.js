
const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, message: 'Profile fetched successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        let {
            firstName,
            lastName,
            gender,
            yearOfBirth,
            shortBio,
            country,
            location
        } = req.body;

        const isNewUser = false;
        let profileImageUrl;
        location = JSON.parse(location);

        if (req.file) {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'profile_pictures',
                },
                async (error, result) => {
                    if (error) {
                        return res.status(500).json({ success: false, error: 'Image upload failed' });
                    }

                    profileImageUrl = result.secure_url;

                    try {
                        const updatedUser = await User.findOneAndUpdate(
                            { email: req.user.email },
                            {
                                $set: {
                                    firstName,
                                    lastName,
                                    gender,
                                    yearOfBirth,
                                    shortBio,
                                    country,
                                    isNewUser,
                                    profileImage: profileImageUrl,
                                    location
                                },
                            },
                            { new: true }
                        );

                        if (!updatedUser) {
                            return res.status(404).json({ success: false, error: 'User not found' });
                        }

                        return res.json({
                            success: true,
                            message: 'Profile updated successfully',
                            user: updatedUser
                        });
                    } catch (err) {
                        return res.status(500).json({ success: false, error: 'Server error' });
                    }
                }
            );

            require('streamifier').createReadStream(req.file.buffer).pipe(uploadStream);
        } else {
            const updatedUser = await User.findOneAndUpdate(
                { email: req.user.email },
                {
                    $set: {
                        firstName,
                        lastName,
                        gender,
                        yearOfBirth,
                        shortBio,
                        country,
                        isNewUser,
                        location
                    },
                },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            return res.json({
                success: true,
                message: 'Profile updated successfully',
                user: updatedUser
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
