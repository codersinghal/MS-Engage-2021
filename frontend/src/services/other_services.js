import axios from 'axios';


const client = axios.create({
    baseURL: "http://localhost:4001" 
  });

export default {

    getTeams_service: async function(userID){
        try {
            const resp=await client.get('/getTeams/'+userID);
            return resp.data;
        } catch (error) {
            throw error;
        }
    },

    getTeamDetails_service: async function(teamID){
        try {
            const resp=await client.get('/getTeamDetails/'+teamID);
            return resp.data;
        } catch (error) {
            throw error;
        }
    },

    createNewTeam_service: async function(userID,teamName){
        try {
            const body={userID:userID,teamName:teamName};
            const resp=await client.post('/createNewTeam',body);
            return resp.data;
        } catch (error) {
            throw error;
        }
    },

    joinNewTeam_service: async function(userID,teamCode){
        try {
            const body={userID:userID,teamCode:teamCode};
            const resp=await client.post('/joinNewTeam',body);
            return resp.data
        } catch (error) {
            throw error
        }
    }

}