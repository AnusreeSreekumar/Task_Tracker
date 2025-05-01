import { Router } from "express";
import Tasks from "../Models/taskSchema.js";
import authenticate from "../Middleware/authorisation.js";

const taskrouter = Router();

taskrouter.post("/createTask", authenticate, async (req, res) => {
 
  const loginEmail = req.email;

  if (loginEmail) {
    try {
      const { title, description, status, project } = req.body;
      const taskExist = await Tasks.findOne({ dbtitle: title });

      if (taskExist) {
        res.status(400).json({ message: "Task already present" });
        console.log("Task is present");
      } else {
        const newtask = new Tasks({
          dbtitle: title,
          dbdescription: description,
          dbstatus: status,
          dbprojects: project,
        });
        await newtask.save();
        res.status(201).json({ message: "Task created successfully" });
        console.log("Task is added to DB");
      }
    } catch (error) {
      res.status(500).json(error);
      console.log("Create Task operation failed");
    }
  } else {
    res.status(404).json({ message: "User needs to login" });
    console.log("Please login");
  }
});

taskrouter.patch("/updateTask", authenticate, async (req, res) => {
  
  const loginEmail = req.email;

  if (loginEmail) {
    try {
      const { title, status } = req.body;
      const taskExist = await Tasks.findOne({ dbtitle: title });
      if (taskExist) {
        switch (status) {
          case "in progress":
            taskExist.dbstatus = status;
            taskExist.updatedAt = new Date();
            break;
          case "completed":
            taskExist.dbstatus = status;
            taskExist.completedAt = new Date();
            break;
        }
        await taskExist.save();
        return res.status(200).json({ message: "Task updated successfully" });
      } else {
        return res.status(404).json({ message: "Task not found" });
      }
    } catch (error) {
      console.error("Update operation failed");
      res.status(500).json(error);
    }
  } else {
    res.status(404).json({ message: "User needs to login" });
    console.log("Please login");
  }
});

taskrouter.get("/readTask/:id", authenticate, async (req, res) => {
  
  const loginEmail = req.email;

  if (loginEmail) {
    try {
      const tasktitle = req.params.id;
      console.log("1", tasktitle);

      const taskExist = await Tasks.findOne({ dbtitle: tasktitle });

      if (taskExist) {
        res.status(201).json({ taskExist });
        console.log("Task details displayed");
      } else {
        res.status(404).json({ message: "Selected Task not present" });
        console.log("Task not present in DB");
      }
    } catch (error) {
      console.error("Read operation failed");
      res.status(500).json(error);
    }
  } else {
    res.status(404).json({ message: "User needs to login" });
    console.log("Please login");
  }
});

taskrouter.delete("/deletTask/:id", authenticate, async (req, res) => {
  
  const loginEmail = req.email;

  if (loginEmail) {
    try {
      const tasktitle = req.params.id;
      const taskExist = await Tasks.findOne({ dbtitle: tasktitle });

      if (taskExist) {
        await Tasks.deleteOne({ dbtitle: tasktitle });
        res.status(201).json("Task details deleted successfully");
        console.log("Tasks deleted from DB");
      } else {
        res.status(404).json("Task not present");
        console.log("Task not found in DB");
      }
    } catch (error) {
      res.status(500).json(error);
      console.log("Delete operation failed");
    }
  } else {
    res.status(404).json({ message: "User needs to login" });
    console.log("Please login");
  }
});

export default taskrouter;
