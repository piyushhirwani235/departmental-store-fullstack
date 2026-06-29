module.exports = (req, res, next) => {
    // req.user comes from the authMiddleware that runs right before this
    if (req.user && req.user.role === 'admin') {
        next(); // They are an admin, let them through
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};