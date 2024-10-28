const jwt = require("jsonwebtoken");
const models = require("../models");
const argon2 = require("argon2");
const bcrypt = require("bcrypt");
async function signup(req, res) {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await models.User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = models.User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await models.User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid email or password." });

   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

    // Generate tokens
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1m" });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1m" });

    // Set the refresh token in an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // This makes the cookie inaccessible to JavaScript
      secure: true, // Set to true in production if using HTTPS
      sameSite: "Strict", // Adjust based on your needs
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiry time (1 day)
  })
      .json({ accessToken });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
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
      // Return an error if token verification fails
      return { error: true, message: "Unauthorized" };
    }
  };

  const decodedToken = decodeToken();

  // Check if there was an error during decoding
  if (decodedToken.error) {
    return decodedToken;
  }

  
  const userId = decodedToken.userId;

  
  const userDoc = await models.User.findById(userId).exec();
  if (!userDoc) {
    return { error: true, statusCode: 404, message: "User not found" };
  }

  // Return the decoded token 
  return { valid: true, userId: userId }; 
};

async function newAccessToken(req, res) {
  //const refreshToken= req.cookies.refreshToken;
  const refreshToken = await validateRefreshToken(req.cookies.refreshToken);
  const accessToken = createAccessToken(refreshToken.userId);
  
  res.json({
    id: refreshToken.userId,
    accessToken,
  });
}

function createAccessToken(userId) {
  return jwt.sign(
    {
      userId: userId,
    },
    process.env.JWT_SECRET,
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
