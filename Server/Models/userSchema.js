import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    dbemail: { type: String, required: true, unique: true },
    dbpassword: { type: String, required: true },
    dbname: { type: String, required: true },
    dbcountry: { type: String },
    dbprojects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }], 
});

const Users = mongoose.model("dbuser", userSchema);

export default Users