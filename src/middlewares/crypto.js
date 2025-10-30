const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

const generateToken = (data, options = { expiresIn: "24h" }) => {
  return jwt.sign(data, SECRET_KEY, options);
};

const verifyToken = (token) => {
  try {
    const decoded =  jwt.verify(token.split(" ")[1], SECRET_KEY);
    return decoded;
  } catch (error) {
    console.log("error occured", error);
    // return null;
    throw error;
  }
};



module.exports = { verifyToken, generateToken };
