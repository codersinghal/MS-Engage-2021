var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
const User=require('../models/User');
const Schedule=require('../models/Schedules')
const Team=require('../models/Team')

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

// get teams of a user
router.get('/getTeams/:userID',async function(req,res){
    const userID=req.params['userID'];
    try {
        User.findById(userID,function(err,classes){
            if(err)
            {
                console.log(err);
                res.status(500).send('Something went wrong');
            }
            else
            {
                console.log(classes);
                res.status(200).send(classes);
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong');
    }
    
})

// get details of a team
router.get('/getTeamDetails/:teamID',async function(req,res){
    const teamID=req.params['teamID'];
    console.log(teamID)
    try {
        Team.findById(teamID,function(err,classes){
            if(err)
            {
                console.log(err);
                res.status(500).send('Something went wrong');
            }
            else
            {
                console.log(classes);
                res.send(classes);
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong');
    }
    
})

// create new team
router.post('/createNewTeam',async function(req,res){
    const {userID,teamName}=req.body;
    try {
        
        const user=await User.findById(userID);
        const teamCode=create_UUID()
        const teamAdmins=[{adminID:userID,adminFirstName:user.first_name,adminLastName:user.last_name}];
        const teamMembers=[{memberID:userID,memberFirstName:user.first_name,memberLastName:user.last_name}];
        const schedules=[];
        const newTeam=await Team.create({teamName:teamName,teamCode:teamCode,teamAdmins:teamAdmins,teamMembers:teamMembers,schedules:schedules})

        if(!newTeam)
        {
            res.status(500).send('Create new team failed')
            return ;
        }
        await User.findByIdAndUpdate(userID,{
        $addToSet:{teams:{teamID:newTeam,teamName:teamName}}
        },{ useFindAndModify: false })

        res.status(200).send('Team Created')
    }    
    catch (error) {
        console.log(error)
        res.status(500).send('Create new team failed')
    }
    

    
})

// join a team
router.post('/joinNewTeam',async function(req,res){
    const {userID,teamCode}=req.body;
    try {
        const user=await User.findById(userID);
        const newTeam=await Team.findOneAndUpdate({teamCode:teamCode},{
            $addToSet:{teamMembers:{memberID:userID,memberFirstName:user.first_name,memberLastName:user.last_name}}
        },{ useFindAndModify: false })
    
        if(!newTeam)
        {
            console.log('Joining Team Failed');
            res.status(400).send('Joining Team Failed')
            return;
        }
    
        console.log(newTeam)
        await User.findByIdAndUpdate(userID,{
            $addToSet:{teams:{teamID:newTeam,teamName:newTeam.teamName}}
            },{ useFindAndModify: false })
         
        res.status(200).send('Team Joined Successfully')    

    } catch (error) {
        console.log(error);
        res.status(500).send('Joining Team Failed')
    }


})

router.post('/createNewEvent',async function(req,res){
    req.body.start=new Date(req.body.start)
    req.body.end=new Date(req.body.end)
    const {teamID,title,desc,start,end}=req.body;

    const scheduledInTeam=[teamID];
    try {
        const newSchedule=await Schedule.create({title:title,desc:desc,start:start,end:end,scheduledInTeam:scheduledInTeam});
        if(!newSchedule)
        {
            res.status(500).send('Event creation failed');
        }
        const data={scheduleID:newSchedule,
            title:title,
            desc:desc,
            start:start,
            end:end}
        await Team.findByIdAndUpdate(teamID,{
            $addToSet:{
                schedules:data
            }
        },{useFindAndModify:false})
        res.status(200).send(data)
    } catch (error) {
        console.log(error);
        res.status(500).send('Event creation failed')
    }
})

// api call to update event
router.put('/updateEvent',async function(req,res){
    console.log(req.body);
    req.body.start=new Date(req.body.start)
    req.body.end=new Date(req.body.end)
    const {teamID,title,desc,start,end,scheduleID}=req.body;
    const data={title:title,desc:desc,start:start,end:end,scheduledInTeam:[teamID]}
    try {
        const newSchedule=await Schedule.findByIdAndUpdate(scheduleID,data,{new:true})
        if(!newSchedule)
        {
            res.status(500).send('Event Update Failed')
        }
        await Team.updateOne(
            {_id:teamID,'schedules.scheduleID':scheduleID},
            {
                $set:{
                    'schedules.$.title':title,
                    'schedules.$.desc':desc,
                    'schedules.$.start':start,
                    'schedules.$.end':end
                }
            }
        )
        console.log(newSchedule)
        res.status(200).send(newSchedule);
    } catch (error) {
        console.log(error)
        res.status(500).send('Event Update Failed')
    }

})

router.delete('/deleteEvent',async function(req,res){
    const {scheduleID,teamID}=req.body;
    try {
        await Schedule.findByIdAndDelete(scheduleID);
        await Team.updateOne({_id:teamID},{
            $pull:{
                "schedules": { "scheduleID": scheduleID }
            }
        })
        res.status(200).send('Event deleted successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Could not delete event')
    }
})



module.exports=router;