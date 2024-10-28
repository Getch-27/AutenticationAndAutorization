const jwt = require("jsonwebtoken");
const models = require("../models");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI  = process.env.GOOGLE_REDIRECT_URI
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, GOOGLE_REDIRECT_URI);

async function signup(req, res) {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await models.User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance ans save
    const newUser = models.User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function googleCallback(req, res) {
  const { code } = req.query; // Get the code from the query parameters

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Use the access token to get user information
    const userInfoResponse = await oauth2Client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const userData = userInfoResponse.data;

    // Check if the user already exists in the database
    let user = await models.User.findOne({ email: userData.email });
    if (!user) {
      // If the user doesn't exist, create a new user
      user = await models.User.create({
        username: userData.name,
        email: userData.email,
        // Add any other necessary fields
      });
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });

    // Set the refresh token as an HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure to true in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect to the client profile page
    res.redirect(`http://localhost:5173/profile?accessToken=${accessToken}`);
  } catch (error) {
    console.error("Error during OAuth callback", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await models.User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password." });

    // Generate tokens
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // Set the refresh token in an HTTP-only cookie
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true, // cookie inaccessible to JavaScript
        secure: true,
        sameSite: "Strict",
      })
      .json({ accessToken });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const validateRefreshToken = async (token) => {
  const decodeToken = () => {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return { error: true, message: "Unauthorized" };
    }
  };

  const decodedToken = decodeToken();
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

function createRefreshToken(userId) {
  return jwt.sign(
    {
      userId: userId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1m",
    }
  );
}
module.exports = { signup, login, googleCallback, newAccessToken };
