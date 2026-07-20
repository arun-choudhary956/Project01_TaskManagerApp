const jwt = require('jsonwebtoken');

// Protects routes - only lets requests through if a valid JWT is provided
const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user id to request so route handlers know who is making the request
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = protect;
