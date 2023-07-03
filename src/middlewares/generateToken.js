
const jwt = require('jsonwebtoken');
const colors = require('colors');
const express = require('express')
const app = express()



// Middleware to validate API key
module.exports = (req, res, next) => {
    console.log(colors.red('Validating API key ...'))
    const apiKey = req.headers['x-api-key'];
    
    // Check if the API key is valid
    if (apiKey === process.env.TOKEN_SECRET) {
        console.log(colors.green('Access granted !'))
        generateToken(req, res, next);
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };


  const generateToken = async (req, res, next) => {
    console.log(colors.red('Generating token ...'))
    const payload = { 
      // userId: userId,
      // userRole: userRole,
      date: Date.now()
     };
     
     try {
      const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    //   res.json({ token });
        req.token = token;
        console.log(colors.cyan('Token generated !'))
        next();
     }
      catch (err) {
      res.status(500).json({ message: err.message });
    }
  }


  
//   // Route to generate a token
//   app.post('/generate-token', authenticate, (req, res, next) => {
//     // const { userId, userRole } = req.body;
  
//     console.log(req.body)
  
//     const payload = { 
//       // userId: userId,
//       // userRole: userRole,
//       date: Date.now()
//      };
     
//      try {
//       const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });
//       res.json({ token });

//      }
//       catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });