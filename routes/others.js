var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
const User=require('../models/User');
const Schedule=require('../models/Schedules')
const Team=require('../models/Team')


// get teams of a user
router.get('/getTeams/:userID',async function(req,res){
    const userID=req.params['userID'];
    User.findById(userID).select('teams').populate({path:'teams',select:'teamName'}).exec(function(err,classes){
        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else
        {
            console.log(classes)
            res.status(200).send(classes)
        }
    })
})

// get details of a team
router.get('/getTeamDetails/:teamID',async function(req,res){
    const teamID=req.params['teamID'];
    Team.findById(teamID).populate([{path:'teamAdmins',select:'first_name last_name'},{path:'teamMembers',select:'first_name last_name'},{path:'schedules',select:'-scheduledInTeam'}]).exec(function(err,classes){
        if(err)
        {
            console.log(err)
            res.send(err);
        }
        else
        {
            console.log(classes);
            res.status(200).send(classes);
        }
    })
})

// create new team
router.post('/createNewTeam',async function(req,res){
    const {userID,teamName}=req.body;
    const teamCode='qwertyuiop'
    var teamAdmins=[userID];
    var teamMembers=[userID];
    var schedules=[];
    const newTeam=await Team.create({teamName:teamName,teamCode:teamCode,teamAdmins:teamAdmins,teamMembers:teamMembers,schedules:schedules})

    if(!newTeam)
    return;

    await User.findByIdAndUpdate(userID,{
        $addToSet:{teams:newTeam}
    },{ useFindAndModify: false })

    User.findById(userID).select('teams').populate({path:'teams',select:'teamName'}).exec(function(err,classes){
        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else
        {
            console.log(classes)
            res.status(200).send(classes)
        }
    })
    
})

// join a team
router.post('/joinNewTeam',async function(req,res){
    const {userID,teamCode}=req.body;
    const newTeam=await Team.findOneAndUpdate({teamCode:teamCode},{
        $addToSet:{teamMembers:userID}
    },{ useFindAndModify: false })

    if(!newTeam)
    {
        console.log('joining team failed');
        res.send('joining team failed')
    }

    console.log(newTeam)
    await User.findByIdAndUpdate(userID,{
        $addToSet:{teams:newTeam}
    },{ useFindAndModify: false })

    console.log('done')

    User.findById(userID).select('teams').populate({path:'teams',select:'teamName'}).exec(function(err,classes){
        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else
        {
            console.log(classes)
            res.status(200).send(classes)
        }
    })



})



module.exports=router;