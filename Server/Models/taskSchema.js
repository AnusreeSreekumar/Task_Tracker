import mongoose from "mongoose";

const Taskschema = new mongoose.Schema({

    dbtitle: { type: String, required: true, unique: true },
    dbdescription: { type: String, required: true },
    dbstatus: { type: String, required: true, enum: ['started', 'in progress', 'completed'] },
    dbprojects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }], 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null }
})

const Tasks = mongoose.model("dbTasks", Taskschema);

export default Tasks