import express from 'express';
import User from '../models/userModel.js';
import { validateCSRFToken } from '../middlewares/csrfMiddleware.js';

const router = express.Router();

/**
 * @route   GET /profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get("/", async (req, res) => {
    try {
        // Get user from authenticated request
        const userId = req.user?._id;
        const userEmail = req.user?.email;

        if (!userId && !userEmail) {
            return res.status(401).json({
                error: 'User not authenticated',
                code: 'NOT_AUTHENTICATED'
            });
        }

        // Find user by ID or email
        const user = await User.findOne({
            $or: [{ _id: userId }, { email: userEmail }]
        }).select('-password');

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

        return res.json({
            success: true,
            profile: user
        });

    } catch (err) {
        console.error('Profile fetch error:', err);
        return res.status(500).json({
            error: 'Failed to fetch profile',
            code: 'PROFILE_FETCH_ERROR'
        });
    }
});

/**
 * @route   PUT /profile
 * @desc    Update current user's profile
 * @access  Private (CSRF protected)
 */
router.put("/", validateCSRFToken, async (req, res) => {
    try {
        const userId = req.user?._id;
        const userEmail = req.user?.email;

        if (!userId && !userEmail) {
            return res.status(401).json({
                error: 'User not authenticated',
                code: 'NOT_AUTHENTICATED'
            });
        }

        // Fields that can be updated
        const allowedUpdates = ['name', 'profilePicture', 'bio', 'company', 'location'];
        const updates = {};

        for (const field of allowedUpdates) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                error: 'No valid fields to update',
                code: 'NO_UPDATES'
            });
        }

        const user = await User.findOneAndUpdate(
            { $or: [{ _id: userId }, { email: userEmail }] },
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

        return res.json({
            success: true,
            profile: user
        });

    } catch (err) {
        console.error('Profile update error:', err);
        return res.status(500).json({
            error: 'Failed to update profile',
            code: 'PROFILE_UPDATE_ERROR'
        });
    }
});

export default router;
