const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthMiddleware {
  constructor(secret) {
    this.JWT_SECRET = secret || process.env.JWT_SECRET;
  }

  authenticateToken(roles) {
    return (req, res, next) => {
      // Log cookies to verify they are populated
      
      // console.log("Cookies received before: ", req.cookies);
      // Try to get the token from the cookies first.
      let token = req.cookies && req.cookies.token;
      // console.log("Cookies received after: ", req.cookies);
      // Fallback to header (if needed)
      if (!token) {
        const authHeader = req.headers.authorization || '';
        token = authHeader.split(' ')[1];
      }

      // console.log("Token received after:", token);

      if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
      }
      jwt.verify(token, this.JWT_SECRET, (err, decoded) => {
        if (err) {
          const message = err.name === 'TokenExpiredError' ? 'Authentication token has expired' : 'Invalid authentication token';
          console.log("Token verification error:", err);
          return res.status(401).json({ message });
        }

        const userRoles = decoded.roles || [decoded.role]; // Normalize roles into an array
        const hasRequiredRole = roles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ message: 'Access Denied: Insufficient permissions' });
        }

        req.user = decoded; // Attach decoded token info to req
        next();
      });
    };
  }
}

const authMiddleware = new AuthMiddleware();
module.exports = { authenticateToken: authMiddleware.authenticateToken.bind(authMiddleware) };
