import { Router } from "express";
import Users from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticate from "../Middleware/authorisation.js";

const userrouter = Router();

userrouter.post("/signupUser", async (req, res) => {
  try {
    const { name, email, password, country, project } = req.body;

    const hashpswrd = await bcrypt.hash(password, 10);
    const emailExist = await Users.findOne({ dbEmail: email });

    if (!emailExist) {
      const newuser = new Users({
        dbname: name,
        dbemail: email,
        dbpassword: hashpswrd,
        dbcountry: country,
        dbprojects: project,
      });
      await newuser.save();
      res.status(200).json({ message: "User created successfully" });
    } else {
      res.status(404).json({ message: "User already present" });
    }
  } catch (error) {
    res.status(500).json(error);
    console.log("Create User operation failed");
  }
});

userrouter.post("/loginUser", async (req, res) => {
  const secret_key = process.env.SECRET_KEY;
  console.log("key: ", secret_key);

  try {
    const { email, password } = req.body;
    const emailExist = await Users.findOne({ dbemail: email });

    if (emailExist) {
      const isvalid = await bcrypt.compare(password, emailExist.dbpassword);

      if (isvalid) {
        const token = jwt.sign({ userId: emailExist._id, email: emailExist.dbemail }, secret_key, { expiresIn: "1h" });
        res.cookie("Tasktoken", token, { httpOnly: true });
        res.status(200).json({ message: "Success" });
        console.log("Login Successfull");
      }
    }
  } catch (error) {

    res.status(500).json(error);
    console.log("Login User operation failed");
  }
});

userrouter.patch("/updateUser", authenticate, async (req, res) => {
  
try {
      const loginId = req.userId;
      const { name, country, projects } = req.body;
      const userExists = await Users.findOne({ _id : loginId });
    
      if (!userExists) {
        
        return res.status(404).json({ message: "User not found" });
      }
      else{

        if(name) userExists.dbname = name;
        if(country) userExists.dbcountry = country;
        if (projects) {
            if (userExists.dbprojects.length >= 4) {
                return res.status(400).json({ message: "User cannot have more than 4 projects" });
            }
            userExists.dbprojects.push(projects);
        }
        await userExists.save();
        res.status(200).json({ message: "User updated successfully" });
        console.log("User details updated in DB");
        
      }
} catch (error) {
    
    res.status(500).json(error);
    console.log("Update User operation failed");
}
});

userrouter.delete("/deleteUser", authenticate, async(req,res) => {

    try {
        
        const loginId = req.userId;
        const userExists = await Users.findOne({ _id : loginId };
        if(userExists){

            await Users.deleteOne({ _id : loginId });
            res.status(200).json("USer details deleted successfully");
            console.log("User deleted from DB");
        }
        else{

            res.status(404).json("User not found")
        }
    } catch (error) {
        
        res.status(500).json(error);
        console.log("Delete User operation failed");
    }
})

export default userrouter;
