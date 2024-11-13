const mongoose = require('mongoose');


const teacherSchema=new mongoose.Schema({
    name:{type:String , required:true},
    subject: { type: String, required: true },
    uniqueId:{type:String, required:true ,unique:true},
    password: { type: String, required: true },
})


const Teacherdb=new mongoose.model('Teacherdb',teacherSchema);

module.exports=Teacherdb;