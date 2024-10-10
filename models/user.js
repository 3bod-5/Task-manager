const mongoose = require("mongoose")
const connect = mongoose.connect("mongodb://127.0.0.1:27017/taskmanager")
var schema = mongoose.Schema;
connect.then(() =>{
    console.log("Database connected succefuly")
}).catch(() => {
    console.log("Database cannot connect")
})

const task = new schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    completed: { type: Boolean, required: true, default: false },
})

const user = new mongoose.Schema({
    name: { type: String, required: true },
    password:{type:String,required:true},
    tasks: [task]
});



const collection = new mongoose.model("taskmanager",user)

module.exports = collection