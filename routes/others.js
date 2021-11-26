var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
const User=require('../models/User');
const Schedule=require('../models/Schedules')
const Team=require('../models/Team')
const queue=require('../queue/queue')
const verifyToken =require('../middleware/verifyToken')

// create uid for team code
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

// verify and add message to queue
async function checkAndAddToQueue(schedule,team,status){
    console.log(schedule)
    if(!team.teamSlackChannel || !team.teamSlackToken)
    {
        console.log('Not adding to queue')
        return ;
    }
    const messageData={slackToken:team.teamSlackToken,
        slackChannel:team.teamSlackChannel,
        title:schedule.title,
        desc:schedule.desc,
        start:schedule.start,
        specialMention:null,
        status:status
    }
    if(schedule.specialMention && schedule.specialMention.length>0)
        messageData.specialMention=schedule.specialMention[0].memberFirstName+" "+schedule.specialMention[0].memberLastName
        queue.addMessageToQueue([messageData])
}

// To keep server up
router.get('/ping',async function(req,res){
    res.send('Server is up');
})

// get teams of a user
router.get('/myTeams/:userID',verifyToken,async function(req,res){
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
                res.status(200).send(classes);
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong');
    }
    
})

// get details of a team
router.get('/myTeamDetails/:teamID',verifyToken,async function(req,res){
    const teamID=req.params['teamID'];
    try {
        Team.findById(teamID,function(err,classes){
            if(err)
            {
                console.log(err);
                res.status(500).send('Something went wrong');
            }
            else
            {
                res.send(classes);
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong');
    }
    
})

// create new team
router.post('/createNewTeam',verifyToken,async function(req,res){
    const {userID,teamName,slackChannel,slackToken}=req.body;
    try {
        
        // create team and add user to admin
        const user=await User.findById(userID);
        const teamCode=create_UUID()
        const teamAdmins=[{adminID:userID,adminFirstName:user.first_name,adminLastName:user.last_name}];
        const teamMembers=[{memberID:userID,memberFirstName:user.first_name,memberLastName:user.last_name}];
        const schedules=[];
        const newTeam=await Team.create({teamName:teamName,teamCode:teamCode,teamSlackChannel:slackChannel,teamSlackToken:slackToken,teamAdmins:teamAdmins,teamMembers:teamMembers,schedules:schedules})

        if(!newTeam)
        {
            res.status(500).send('Create new team failed')
            return ;
        }
        // add team in user teams
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
router.post('/joinNewTeam',verifyToken,async function(req,res){
    const {userID,teamCode}=req.body;
    try {
        // add user to team members
        const user=await User.findById(userID);
        const newTeam=await Team.findOneAndUpdate({teamCode:teamCode},{
            $addToSet:{teamMembers:{memberID:userID,memberFirstName:user.first_name,memberLastName:user.last_name}}
        },{ useFindAndModify: false })
    
        if(!newTeam)
        {
            res.status(400).send('Joining Team Failed')
            return;
        }
        // add team to user teams
        await User.findByIdAndUpdate(userID,{
            $addToSet:{teams:{teamID:newTeam,teamName:newTeam.teamName}}
            },{ useFindAndModify: false })
         
        res.status(200).send('Team Joined Successfully')    

    } catch (error) {
        console.log(error);
        res.status(500).send('Joining Team Failed')
    }


})

// create new event
router.post('/createNewEvent',verifyToken,async function(req,res){
    console.log(req.body.start)
    req.body.start=new Date(req.body.start)
    req.body.end=new Date(req.body.end)
    const {teamID,title,desc,start,end}=req.body;
    var specialMention=req.body.specialMention;
    if(specialMention)
    specialMention=[{memberID:specialMention.memberID,memberFirstName:specialMention.memberFirstName,memberLastName:specialMention.memberLastName}]
    const scheduledInTeam=[teamID];
    try {
        const newSchedule=await Schedule.create({title:title,desc:desc,start:start,end:end,scheduledInTeam:scheduledInTeam,specialMention:specialMention});
        if(!newSchedule)
        {
            res.status(500).send('Event creation failed');
        }
        const data={scheduleID:newSchedule,
            title:title,
            desc:desc,
            start:start,
            end:end,
            specialMention:specialMention}
        const team=await Team.findByIdAndUpdate(teamID,{
            $addToSet:{
                schedules:data
            }
        },{useFindAndModify:false})
        res.status(200).send(data)

        // add message to queue on success
        await checkAndAddToQueue(newSchedule,team,'Created')
    } catch (error) {
        console.log(error);
        res.status(500).send('Event creation failed')
    }
})

// api call to update event
router.put('/updateEvent',verifyToken,async function(req,res){
    req.body.start=new Date(req.body.start)
    req.body.end=new Date(req.body.end)
    const {teamID,title,desc,start,end,scheduleID}=req.body;
    var specialMention=req.body.specialMention;
    if(specialMention)
    specialMention=[{memberID:specialMention.memberID,memberFirstName:specialMention.memberFirstName,memberLastName:specialMention.memberLastName}]
    console.log(specialMention)
    const data={title:title,desc:desc,start:start,end:end,scheduledInTeam:[teamID],specialMention:specialMention}
    try {
        const newSchedule=await Schedule.findByIdAndUpdate(scheduleID,data,{new:true})
        if(!newSchedule)
        {
            res.status(500).send('Event Update Failed')
        }
        const team=await Team.findOneAndUpdate(
            {_id:teamID,'schedules.scheduleID':scheduleID},
            {
                $set:{
                    'schedules.$.title':title,
                    'schedules.$.desc':desc,
                    'schedules.$.start':start,
                    'schedules.$.end':end,
                    'schedules.$.specialMention':specialMention
                }
            }
        )
        res.status(200).send(newSchedule);

        // add message to queue on success
        await checkAndAddToQueue(newSchedule,team,'Updated')
    } catch (error) {
        console.log(error)
        res.status(500).send('Event Update Failed')
    }

})

// api to delete event
router.delete('/deleteEvent',verifyToken,async function(req,res){
    const {scheduleID,teamID}=req.body;

    try {
        if(!scheduleID || !teamID)
        {
            throw 'Could not delete event';
        }
        const newSchedule=await Schedule.findById(scheduleID)
        await Schedule.findByIdAndDelete(scheduleID);
        const team=await Team.findByIdAndUpdate({_id:teamID},{
            $pull:{
                "schedules": { "scheduleID": scheduleID }
            }
        })
        res.status(200).send('Event deleted successfully');

        // add message to queue on success
        await checkAndAddToQueue(newSchedule,team,'Deleted')
    } catch (error) {
        console.log(error);
        res.status(500).send('Could not delete event')
    }
})



module.exports=router;