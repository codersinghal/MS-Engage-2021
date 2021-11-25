import axios from 'axios';

const baseURL=process.env.NODE_ENV==='production'?"https://lit-dusk-25263.herokuapp.com":"http://localhost:4001"
const client = axios.create({
    baseURL: baseURL
  });


// services for authentication  
export default {

    // request for signing up
    register_service: async function(first_name,last_name,email,password) {
        try {
            const body={first_name:first_name,last_name:last_name,email:email,password:password};
            const resp=await client.post('/register',body);
            return resp.data;
            
        } catch (error) {
            throw error.response.data;
        }
    },

    // request for logging in
    login_service: async function(email,password) {
        try {
            const body={email:email,password:password};
            const resp=await client.post('/login',body);
            return resp.data;
        } catch (error) {
            throw error.response.data
        }
    }
}