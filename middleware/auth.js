const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Handle both id and userId from token
    req.user = {
      id: decoded.id || decoded.userId,
      role: decoded.role
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
