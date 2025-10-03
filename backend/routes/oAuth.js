
const express = require("express");
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User= require('../models/userModel')
const { generateToken } = require("../controllers/userController");   


router.post('/google' ,async (req, res) => {
  const { token } = req.body;


  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name,picture, sub } = payload;

    let user = await User.findOne({email});
      if (!user) {
        user = await User.create({
          email,
          name: name,
          password: null,
          role:"user",
          image: picture,
          preferredLanguage:"en",
          categoryInterest:[]
        });
      }
    
     

  const tokenjwt= await  generateToken(user._id);

    res.status(200).json({ token: tokenjwt, user });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ message: 'Google login failed' });
  }
}
);

 module.exports = router;