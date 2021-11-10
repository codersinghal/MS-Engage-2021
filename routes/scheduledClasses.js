var express=require('express');
var router=express.Router();
const User=require('../models/User');
const Schedule=require('../models/ClassSchedule')
const Booking=require('../models/classBooking')

// get all currently scheduled classes by all teachers
router.get('/allPresentClasses',function(req,res){
        req.body.currDate=new Date(req.body.currDate)
        const {currDate,currTime}=req.body;
        console.log(req.body)
    try {
        Schedule.find({classDate:{$gte:currDate},startTime:{$gte:currTime}},function(err,classes){
            if(err)
            {
                console.log(err);
                res.send("error");
            }
            else
            {
                console.log(classes);
                res.status(200).send(classes);
            }
        })
    }
    catch (error) {

        console.log(error)
    }
})

// get currently schedules classes by a particular teacher
router.get('presentScheduledClasses',function (req,res) {
    const {teacher_id,currDate,currTime}=req.body;
    try {
    Schedule.find({teacher:teacher_id,classDate:{$gte:currDate},startTime:{$gte:currTime}},function (err,classes) {

        if(err)
        {
            console.log(err);
            res.send("error");
        }
        else
        {
            console.log(classes);
            res.status(200).send(classes);
        }
        
    })
}
    catch (error) {
        console.log(error);
    }
})

// get classes scheduled in past by a particular teacher
router.get('pastScheduledClasses',function (req,res) {
    const {teacher_id,currDate,currTime}=req.body;

try{
    Schedule.find({teacher:teacher_id,classDate:{$lte:currDate},startTime:{$lte:currTime}},function (err,classes) {

        if(err)
        {
            console.log(err);
            res.send("error");
        }
        else
        {
            console.log(classes);
            res.status(200).send(classes);
        }
        
    })
}
catch (error) {
    console.log(error);
}
    
})

// add a new class schedule
router.post('/postNewClass',function (req,res) {
    req.body.classDate=new Date(req.body.classDate)
    const classSch= Schedule(req.body);
    try {
    Schedule.create(classSch,function (err,newClassSch) {
        if(err)
        {
            console.log(err);
            res.send('error');
        }
        else
        {
            console.log(newClassSch);
            User.findById(classSch.teacher,function(err,db_user){
                if(err)
                {
                    console.log(err);
                    res.send('error')
                }
                else
                {
                    newClassSch.teacher=db_user;
                    newClassSch.save();
                    res.status(200).send('class added successfully')
                }
            })
        }
    })
}
    catch (error) {
         console.log(error);
    }
    
})

module.exports=router;