const cron = require("node-cron")
const Schedule=require('../models/Schedules')
const Team=require('../models/Team')
const queue=require('../queue/queue')

async function getScheduledEvents() {
    const currDate=new Date();
    var reqDate=new Date();
    reqDate.setDate(reqDate.getDate()+1)
    console.log(currDate)
    console.log(reqDate)
    
    try {
        Schedule.find({start:{$gte:currDate,$lte:reqDate}},async function(err,schedules){
            console.log(schedules)
            if(err)
            {
                console.log(err)
                return;
            }
            var messages=[]
            await Promise.all(schedules.map(async (schedule) =>{
                console.log(schedule.scheduledInTeam[0]._id)
                const team= await Team.findById(schedule.scheduledInTeam[0]._id);
                console.log(team)
                const messageData={slackToken:team.teamSlackToken,
                    slackChannel:team.teamSlackChannel,
                    title:schedule.title,
                    desc:schedule.desc,
                    start:schedule.start,
                    specialMention:null,
                    status:'Reminder'
                }
                if(schedule.specialMention && schedule.specialMention.length>0)
                    messageData.specialMention=schedule.specialMention[0].memberFirstName+" "+schedule.specialMention[0].memberLastName
                if(team.teamSlackChannel && team.teamSlackToken)
                {
                    console.log(messageData)
                    messages.push(messageData)
                }
                
            }))
            console.log(messages)
            queue.addMessageToQueue(messages)
        })
    } catch (error) {
        console.log(error)
    }
    
    
}

exports.cron_job=()=>{

    cron.schedule("00 59 23 * * *", () => getScheduledEvents(), {
      scheduled: true,
      timezone: "Asia/Kolkata",
    });
}
