const jwt = require("jsonwebtoken");

const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  
  if (!token) {
    return res.status(401).json({ message: 'Access token missing or invalid' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }

    return res.status(401).json({ message: 'unautorized' });
  }
};

module.exports = {
  verifyAccessToken
};
