const jwt = require("jsonwebtoken");

const verifyAccessToken = async (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  if (!token || token === "null") {
    return res.status(401).json({ message: 'Access token missing or invalid' });
  }

  try {
    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId; 
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);

 
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }

    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = {
  verifyAccessToken
};
