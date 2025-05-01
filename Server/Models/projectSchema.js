import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    dbprojectname: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const Projects = mongoose.model("dbProjects", projectSchema)
export default Projects