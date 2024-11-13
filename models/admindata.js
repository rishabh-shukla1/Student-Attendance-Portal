const mongoose = require('mongoose');


const adminSchema=new mongoose.Schema({
   
    uniqueId:{type:String, required:true ,unique:true},
    password: { type: String, required: true },
})


const Admin=new mongoose.model('Admindata',adminSchema);

const createDefaultAdmin = async () => {
    try {
        // Check if an admin already exists
        const adminExists = await Admin.findOne({ uniqueId: 'admin' });
        
        if (!adminExists) {
            // Create a default admin if none exists
            const defaultAdmin = new Admin({
                uniqueId: '12345', // Default unique ID
                password: '12345', // Default password (hash this for security in a real application)
            });

            await defaultAdmin.save();
            console.log("Default admin created successfully.");
        } else {
            console.log("Admin already exists.");
        }
    } catch (err) {
        console.error("Error creating default admin:", err);
    }
};

// Call the function to create a default admin when this file is executed
// createDefaultAdmin();

module.exports=Admin;
