const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    class: { type: String, required: true },
    rollNumber: { type: String ,required:true},
    uniqueId: { type: String, required: true, unique:true },
    password: { type: String, required: true },

    subjects: {
        type: [
            {
                name: { type: String, required: true },
                attendance: { type: Number, default: 0 },
                totalclass:{type:Number ,default:0},
            }
        ],
        default: () => [
            { name: "hindi", attendance: 0 , totalclass: 0},
            { name: "english", attendance: 0, totalclass: 0},
            { name: "maths", attendance: 0 , totalclass: 0},
            { name: "science", attendance: 0 , totalclass: 0},
            { name: "social-studies", attendance: 0 , totalclass: 0}
        ]
    },

    absence: {  
        type:[ 
            {
                date: { type: Date, required: true },
                subject: { type: String, required: true }
            }
        ],
        default:[]
    },
});




StudentSchema.pre('save', function(next) {
    // Convert `class` to lowercase
    if (this.class) {
        this.class = this.class.toUpperCase(); 
    }

    // Convert each subject's name to lowercase
    if (this.subjects && Array.isArray(this.subjects)) {
        this.subjects.forEach(subject => {
            if (subject.name) {
                subject.name = subject.name.toLowerCase();
            }
        });
    }

    next(); // Proceed with the save operation
});

// Create the Student model
const Studentdb = mongoose.model('Studentdb', StudentSchema);

// Export the model
module.exports = Studentdb;  // Ensure you're exporting the model, not the schema


