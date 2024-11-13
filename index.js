
// requring the expres installed by "npm i install"
const express=require('express')
const app=express();
const path = require('path');

// requiring the models
const studentdb=require('./models/studentdata')
const teacherdb=require('./models/teacherdata')
const admindb=require('./models/admindata')
// console.log(admindb)


// requring mongoose and coomecting it to a database
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)    // connected to student portal database
.then(()=>{console.log("database connected successfully")})
.catch((err)=>{console.log("database not connected", 
    console.log(err)
)})
// middlewares

app.use(express.json()) // to view data of other than form in res.body
app.use(express.urlencoded({extended:true})) // for viewing the form data of from in res.body
app.use(express.static(path.join(__dirname, 'public')));



// set path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// get the origin selection page
app.get('/',(req,res)=>{

    res.render('selection')
    
})


// student  related----------------->

// to get on the sudent page of login  ans also check the login by using post method
app.get('/student',(req,res)=>{
    res.render('studentLogin')
}
)
// to check the  id of password of student
app.post('/student',(req,res)=>{
    
    const{username,Pass}=req.body
    

    studentdb.findOne({uniqueId:username})
    .then((student)=>{

       

        if(!student)
        {
           return  res.status(400).send("no student with this  id")
        }

        if(student.password!=Pass)
        {
            return  res.status(400).send("Incorrect Password");
        }
         
        

        res.render('studentview',{ student })
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send("Internal server error")
    });
    
})







//teacher---->related
// to get on the teacherPage of login
app.get('/teacher',(req,res)=>{
    res.render('teacherLogin')
})
// to check the id and password of teacher
app.post('/teacher',(req,res)=>{
    
    const{username,Pass}=req.body
    
    teacherdb.findOne({ uniqueId:username})
    .then((teacher)=>{

        if(!teacher)
        {
            return res.status(400).send("Teacher not found. Please check your unique ID.");
        }
        
        if(teacher.password!=Pass)
        {
            return res.status(400).send("Incorrect password try again later");
        }

        res.render('subandclass')
    })
    .catch((err)=>{
        console.error("Error during teacher login:", err);
        res.status(500).send("Internal server error. Please try again later.");

    });

        
})







// admin-------------------> 
// admin  page

app.get('/admin',(req,res)=>{
    res.render('adminlogin')
})

//admin login
app.post('/adminlog',(req,res)=>{


    
    const{username,Pass}=req.body
    
    

   
    admindb.findOne({ uniqueId: username })
    .then((admin)=> {
        // console.log("Admin found in database:", admin)
        if(!admin)
        {
            return res.status(400).send("Admin not found. Please check your unique ID.");
        }
        
        if(admin.password!=Pass)
        {
            return res.status(400).send("Incorrect password try again later");
        }

        res.render('change')
    })
    .catch((err)=>{
        console.error("Error during teacher login:", err);
        res.status(500).send("Internal server error. Please try again later.");

    });


})


// admin -add student

app.post('/addstudent',(req,res)=>{
    const{name,class:classname, rollNumber,uniqueId ,password}=req.body


   
   
    const nstudent=new studentdb({
        name,
        class:classname,
        rollNumber,
        uniqueId ,
        password,
        

    })

    nstudent.save()
    .then(() => {

        return  res.status(200).json({message:"added the student"});
       
    })
    .catch(err => {
        console.error("Error adding student:", err.message);
        res.status(500).json({ message: 'Error adding student', error: err.message });
    });
})
// admin -> remove student

app.post('/removestudent',(req,res)=>{

    const{uniqueId}=req.body
    
     studentdb.deleteOne({uniqueId:uniqueId})
     .then((result)=>{

        if(result.deletedCount==0)
        {
            return res.status(404).json({message:"student not found"});
        }

        return res.status(200).json({message:"sucessfully deleted"});

    })
    .catch((err)=>{
        return res.status(500).json("Internal server error");
    });



})


//admin-->add teacher
app.post('/addteacher',(req,res)=>{

    const{name,subject,uniqueId,password}=req.body

    const nteacher=new teacherdb({

        name,
        subject,
        uniqueId,
        password
        

    })
    nteacher.save()
    .then(()=>{
        return res.status(200).json({message:" Teacher added sucessfully "});
        res.render('change');
    })
    .catch((err)=>{

        console.error("Error adding teacher:", err.message);
        res.status(500).json({ message: 'Error adding  teacher', error: err.message });

    });
   


})

// admin-> remove teacher

app.post('/removeteacher',(req,res)=>{

     const{uniqueId}=req.body
    
    
     teacherdb.deleteOne({uniqueId:uniqueId})
     .then((result)=>{

        if(result.deletedCount==0)
        {
            return res.status(404).json({message:"teacher not found"});
        }

        return res.status(200).json({message:"sucessfully deleted"});

    })
    .catch((err)=>{
        return res.status(500).json("Internal server error");
    });



})





// Attendance routes

app.post('/selectClassSubject',(req,res)=>{
    
   const{class:classname,subject}=req.body
   const lowercaseClassname = classname.toUpperCase();
const lowercaseSubject = subject.toLowerCase();

   studentdb.find({class:lowercaseClassname})
   .then((student)=>{
    res.render('attendence',{student,lowercaseClassname,lowercaseSubject})
  })
   .catch((err)=>{
    return res.status(500).jason("Enternal Server Error");
   });
})


// update the attendance taken 
app.post('/takeattendance', (req, res) => {
    const { className, subject, present } = req.body; // Extracting class, subject, and present
    const date = new Date()
    date.setHours(0, 0, 0, 0)

const currentDate = date.toISOString().split('T')[0];
    studentdb.find({class:className})
    .then((student)=>{
        
        student.forEach((student)=>{

            let record=student.subjects.find(sub => sub.name === subject)
            console.log(record)

            if(record)
            {
                record.totalclass+=1;

                if(present.includes(student._id.toString()))
                {
                    record.attendance+=1;
                }
                else{
                   student.absence.push({date: currentDate,subject:subject})
                }
            }

            student.save()
            .then(() => {
                console.log(`Updated student ${student.name}`);
            })
            .catch(Err => {
                console.error(`Error saving student ${student._id}:`, Err);
            });

            
        }
        )
        return res.status(200).json("Updated successfully")

    })
    .catch((err)=>{
        return res.status(500).json("Internal server error");
    });

});

// add subject-->
app.post('/addSubject',(req,res)=>{

    const{subject,className}=req.body;

    const newSubject={
        name:subject,
        attendance:0,
        totalclass:0,
    }
    studentdb.find({class:className})
    .then((student)=>{

        student.forEach((student)=>{

            let record=student.subjects.find((sub)=> sub.name==subject)

            if(!record)
            {
                student.subjects.push(newSubject)
                console.log(student.subjects)
            }

            student.save()
            .then(() => {
                console.log(`Updated student ${student.name} with new subject`);
            })
            .catch((err) => {
                console.error(`Error saving student ${student.name}:`, err);
            });

        })

        return res.status(200).json({ message: "Subject added to all students in class successfully" });
    })
    .catch((err)=>{

    return res.status(500).json("Internal server error")

    });


})






// setting the port where request will go

app.listen(process.env.PORT,()=>{

    console.log("You are on the server");
})
