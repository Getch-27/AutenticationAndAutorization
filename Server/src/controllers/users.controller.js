const models = require("../models");

const profile = async (req, res) => {
  try {
    

    // Fetch user from the database using the userId from the request
    const userDoc = await models.User.findById(req.userId).exec();
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user information
    return res.json({
      id: userDoc._id,
      username: userDoc.username,
      email: userDoc.email,
    });

  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  profile
};
