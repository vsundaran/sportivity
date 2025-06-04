
const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

// exports.updateProfile = async (req, res) => {
//     try {
//         const { firstName, lastName, gender, yearOfBirth, shortBio, country } = req.body;
//         // if the user is updated their profile means, it is not a new user
//         const isNewUser = false
//         const user = await User.findOneAndUpdate(
//             { email: req.user.email },
//             { $set: { firstName, lastName, gender, yearOfBirth, shortBio, country, isNewUser } },
//             { new: true }
//         );
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// }




exports.updateProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            gender,
            yearOfBirth,
            shortBio,
            country,
        } = req.body;

        const isNewUser = false;
        let profileImageUrl;

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload_stream(
                {
                    folder: 'profile_pictures',
                },
                async (error, result) => {
                    if (error) return res.status(500).json({ error: 'Image upload failed' });

                    profileImageUrl = result.secure_url;

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
                            },
                        },
                        { new: true }
                    );

                    return res.json(updatedUser);
                }
            );

            require('streamifier').createReadStream(req.file.buffer).pipe(uploadResult);
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
                    },
                },
                { new: true }
            );

            return res.json(updatedUser);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
