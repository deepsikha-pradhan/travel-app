const jwt = require("jsonwebtoken");


const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

const generateToken = (data, options = { expiresIn: "24h" }) => {
  return jwt.sign(data, SECRET_KEY, options);
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    console.log("error occured", error);
    return null;
  }
};



module.exports = { verifyToken, generateToken };
