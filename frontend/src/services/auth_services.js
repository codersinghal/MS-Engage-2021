import axios from 'axios';

const client = axios.create({
    baseURL: "http://localhost:4001" 
  });


// services for authentication  
export default {

    register_service: async function(first_name,last_name,email,password) {
        try {
            const body={first_name:first_name,last_name:last_name,email:email,password:password};
            const resp=await client.post('/register',body);
            return resp.data;
            
        } catch (error) {
            throw error.response.data;
        }
    },

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