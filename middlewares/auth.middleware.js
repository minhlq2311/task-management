const User = require('../api/v1/models/user.model');

module.exports.requireAuth = async (req, res, next) => {
  if(req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const user = await User.findOne({ tokenUser: token, deleted: false });
      if(user) {
        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
      } else {
        res.status(403).json({ message: 'Unauthorized access' });
      }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(401).json({ message: 'Authorization header is missing' });
    }
}