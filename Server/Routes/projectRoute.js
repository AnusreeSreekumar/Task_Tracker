import { Router } from "express";
import Projects from "../Models/projectSchema.js";

const projectRouter = Router();

projectRouter.post("/createProject", async (req, res) => {
  try {
    const { projectname, tasks } = req.body;
    const projectExist = await Projects.findOne({ dbprojectname: projectname });

    if (projectExist) {
      res.status(400).json({ message: "Project already present" });
      console.log("Project exists in DB");
    } else {
      const newproject = new Projects({
        dbprojectname: projectname,
      });
      await newproject.save();
      res.status(201).json({ message: "Project crated successfully" });
      console.log("Project added to DB");
    }
  } catch (error) {
    console.log("Internal Server Error");
    res.status(500).json({ message: "Unable to create Project" });
  }
});

export default projectRouter
