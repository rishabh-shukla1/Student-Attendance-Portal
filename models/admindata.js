const mongoose = require('mongoose');


const adminSchema=new mongoose.Schema({
   
    uniqueId:{type:String, required:true ,unique:true},
    password: { type: String, required: true },
})


const Admin=new mongoose.model('Admindata',adminSchema);

module.exports=Admin;