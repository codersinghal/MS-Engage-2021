import axios from 'axios';


const client = axios.create({
    baseURL: "http://localhost:4001" 
  });

export default {

    getTeams_service: async function(userID){
        try {
            const resp=await client.get('/getTeams/'+userID);
            return resp.data;
        } catch(error){
            throw error.response.data;
        }
    },

    getTeamDetails_service: async function(teamID){
        try {
            const resp=await client.get('/getTeamDetails/'+teamID);
            return resp.data;
        }
        catch(error){
            throw error.response.data;
        }
    },

    createNewTeam_service: async function(userID,teamName){
        try {
            const body={userID:userID,teamName:teamName};
            const resp=await client.post('/createNewTeam',body);
            return resp.data;
        } catch(error){
            throw error.response.data;
        }
    },

    joinNewTeam_service: async function(userID,teamCode){
        try {
            const body={userID:userID,teamCode:teamCode};
            const resp=await client.post('/joinNewTeam',body);
            return resp.data
        } catch(error){
            throw error.response.data;
        }
    },

    createNewEvent_service: async function(teamID,title,desc,start,end){
        try{
            const body={teamID:teamID,title:title,desc:desc,start:start,end:end};
            const resp=await client.post('/createNewEvent',body);
            return resp.data;
        }
        catch(error){
            throw error.response.data;
        }
    },

    updateEvent_service: async function(teamID,title,desc,start,end,eventID){
        try {
            console.log(eventID)
            const body={teamID:teamID,title:title,desc:desc,start:start,end:end,scheduleID:eventID}
            const resp=await client.put('/updateEvent',body);
            return resp.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    deleteEvent_service: async function(teamID,scheduleID){
        try {
            const body={teamID:teamID,scheduleID:scheduleID}
            const resp=await client.delete('/deleteEvent',body);
            return resp.data;
        } catch (error) {
            throw error.response.data;
        }
    }




}