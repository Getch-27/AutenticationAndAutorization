const jwt = require("jsonwebtoken");
const models = require("../models");
const argon2 = require("argon2");

async function signup(req, res) {
  const userDoc = models.User({
    username: req.body.username,
    email: req.body.email,

    // Hash the password with Argon2
    password: await argon2.hash(req.body.password),
  });
  const refreshTokenDoc = models.RefreshToken({
    owner: userDoc.id,
  });
  await userDoc.save();
  await refreshTokenDoc.save();

  const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id);
  const accessToken = createAccessToken(userDoc.id);

  res.json({
    id: userDoc.id,
    accessToken,
    refreshToken,
  });
}

async function login(req, res) {
  try {
    // Get username and password from the request body
    const { username, password } = req.body;
    // Find the user by username
  
    
    
    const userDoc = await models.User.findOne({ username });
    if (!userDoc) {
    
      return res.status(401).json({ message: "Invalid username or password" });
    }
     
    // Verify the password
    const passwordMatch = await argon2.verify(userDoc.password, password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
   
    // Generate new refrshtoken tokens
    const refreshTokenDoc = await models.RefreshToken({
      owner: userDoc.id,
    });

    await refreshTokenDoc.save();
    const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id);
    const accessToken = createAccessToken(userDoc.id);
    // Send response with tokens
     res.json({
      id: userDoc.id,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function newRefreshToken(req, res) {
  const validationResult = await validateRefreshToken(req.body.refreshToken);

  // Check if validation returned an error
  if (validationResult.error) {
    return res
      .status(validationResult.statusCode)
      .json({ message: validationResult.message });
  }

  // Continue with token generation if validation was successful
  const currentRefreshToken = validationResult;
  const refreshTokenDoc = new models.RefreshToken({
    owner: currentRefreshToken.userId,
  });

  await refreshTokenDoc.save();

  await models.RefreshToken.deleteOne({ _id: currentRefreshToken.tokenId });

  const refreshToken = createRefreshToken(
    currentRefreshToken.userId,
    refreshTokenDoc.id
  );
  const accessToken = createAccessToken(currentRefreshToken.userId);

  res.json({
    id: currentRefreshToken.userId,
    accessToken,
    refreshToken,
  });
}
const validateRefreshToken = async (token) => {
  const decodeToken = () => {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      // Return an error  if token verification
      return { error: true, statusCode: 401, message: "Unauthorized" };
    }
  };

  const decodedToken = decodeToken();

  // Check if there was an error during decoding
  if (decodedToken.error) {
    return decodedToken; 
  }

  // Check if the token exists in the database
  const tokenExists = await models.RefreshToken.exists({
    _id: decodedToken.tokenId,
    owner: decodedToken.userId,
  });

  if (tokenExists) {
    return decodedToken;
  } else {
    // Return an error object if the token does not exist
    return { error: true, statusCode: 401, message: "Unauthorized" };
  }
};

async function newAccessToken(req, res) {
  const refreshToken = await validateRefreshToken(req.body.refreshToken);
  const accessToken = createAccessToken(refreshToken.userId);

  res.json({
    id: refreshToken.userId,
    accessToken,
    refreshToken: req.body.refreshToken,
  });
}

function createAccessToken(userId) {
  return jwt.sign(
    {
      userId: userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10m",
    }
  );
}

function createRefreshToken(userId, refreshTokenId) {
  return jwt.sign(
    {
      userId: userId,
      tokenId: refreshTokenId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
}
module.exports = { signup, login, newRefreshToken, newAccessToken };
