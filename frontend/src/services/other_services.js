import axios from 'axios';

// base url for api server
const baseURL=process.env.NODE_ENV==='production'?"https://lit-dusk-25263.herokuapp.com":"http://localhost:4001"
// create axios client
const client = axios.create({
    baseURL: baseURL,
    headers: { 'x-access-token': localStorage.getItem('token') }
  });

export default {

    // request my teams
    getTeams_service: async function(userID){
        try {
            const resp=await client.get('/myTeams/'+userID);
            return resp.data;
        } catch(error){
            throw error.response.data;
        }
    },

    // request team details
    getTeamDetails_service: async function(teamID){
        try {
            const resp=await client.get('/myTeamDetails/'+teamID);
            return resp.data;
        }
        catch(error){
            throw error.response.data;
        }
    },

    // create new team
    createNewTeam_service: async function(userID,teamName,slackChannel,slackToken){
        try {
            const body={userID:userID,teamName:teamName,slackChannel:slackChannel,slackToken:slackToken};
            const resp=await client.post('/createNewTeam',body);
            return resp.data;
        } catch(error){
            throw error.response.data;
        }
    },

    // join new team
    joinNewTeam_service: async function(userID,teamCode){
        try {
            const body={userID:userID,teamCode:teamCode};
            const resp=await client.post('/joinNewTeam',body);
            return resp.data
        } catch(error){
            throw error.response.data;
        }
    },

    // create new event request
    createNewEvent_service: async function(teamID,title,desc,start,end,specialMention){
        try{
            const body={teamID:teamID,title:title,desc:desc,start:start,end:end,specialMention:specialMention};
            const resp=await client.post('/createNewEvent',body);
            return resp.data;
        }
        catch(error){
            throw error.response.data;
        }
    },

    // update event request
    updateEvent_service: async function(teamID,title,desc,start,end,eventID,specialMention){
        try {
            console.log(eventID)
            const body={teamID:teamID,title:title,desc:desc,start:start,end:end,scheduleID:eventID,specialMention:specialMention}
            const resp=await client.put('/updateEvent',body);
            return resp.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    // delete event request
    deleteEvent_service: async function(teamID,scheduleID){
        try {
            const data={teamID:teamID,scheduleID:scheduleID}
            const resp=await client.delete('/deleteEvent',{data:data});
            return resp.data;
        } catch (error) {
            throw error.response.data;
        }
    }




}