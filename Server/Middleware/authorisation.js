import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret_key = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
  const token = req.cookies.Tasktoken;
  
  if (!token) {
    console.log("TaskToken is not present in cookies");
    res.status(400).json({ message: "Token not present in cookies " });
  }
  try {
    const result = jwt.verify(token, secret_key);
    
    req.userId = result.userId;
    req.email = result.email;
    next();
  } catch (error) {
    console.error('Error verifying token: ', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default authenticate
