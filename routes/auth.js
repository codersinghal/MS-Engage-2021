var express=require('express');
var router=express.Router();
const User=require('../models/User');
var bcrypt=require('bcryptjs')
var jwt=require('jsonwebtoken')
router.post("/register", async (req, res) => {

    // Our register logic starts heres
    console.log('hello')
    try {
      // Get user input
      const { first_name, last_name, email, password } = req.body;
  
      // Validate user input
      console.log(first_name)
      console.log(last_name)
      console.log(email)
      console.log(password)
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(400).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY
      );
      // save user token
      user.token = token;
  
      // return new user
      const resp={userID:user._id,first_name:user.first_name,last_name:user.last_name,token:user.token,email:user.email}
      res.status(200).json(resp);
    } catch (err) {
      res.status(500).send('Something went wrong')
      console.log(err);
    }
    // Our register logic ends here
  });
  
  router.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
      console.log(req.body)
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY
        );
  
        // save user token
        user.token = token;
  
      const resp={userID:user._id,first_name:user.first_name,last_name:user.last_name,token:user.token,email:user.email}
      res.status(200).json(resp);
      }
      else
      {
      console.log('invalid')  
      res.status(400).send("Invalid Credentials");
      }
    } catch (err) {
      res.status(500).send('Something went wrong')
      console.log(err);
    }
    // Our register logic ends here
  });

  module.exports=router;