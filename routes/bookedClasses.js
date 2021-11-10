var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
const User=require('../models/User');
const Schedule=require('../models/ClassSchedule')
const Booking=require('../models/classBooking')


// get present classes booked by a user 
router.get('/presentlyBookedClasses',function(req,res){
    const {student_id,currDate,currTime}=req.body;
    Booking.find({studentID:student_id}).populate({path:'classID',populate:{path:'teacher',select:'first_name last_name'}}).exec(function(err,classes){

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
})

// book a class 
// concurrency handled here
router.post('/bookClass',async function(req,res){
    const session = await mongoose.startSession()
    session.startTransaction()
    try{
    const query={classID:req.body.classID,capacity:{$gte:1}};
    const slot=await Schedule.findOneAndUpdate(query,{
        $inc: {
             capacity: -1
          }
    },{ useFindAndModify: false })
    if (!slot) {
        await session.abortTransaction()
        res.send('No slot available');
    }
    else
    {
    const booking=await Booking.create([{classID:req.body.classID,studentID:req.body.userID}],{session});
    await session.commitTransaction();
    res.send("Slot booked successfully")
    }
}
catch(err){
    console.log(err);
    await session.abortTransaction()
}
finally{
    session.endSession();
}

})

module.exports=router;