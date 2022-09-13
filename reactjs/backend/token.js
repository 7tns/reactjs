const jwt = require("jsonwebtoken");


//Création d'une fonction permmettant de  générer un token

function generateAccessToken(user) {
    return jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1800s",
    });
  }

  //Creation d'une fonction pour avoir un processus d'authentification de l'utilisateur basé sur le token

  function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1];
    // console.log(authHeader)

    // if (!token) {
    //   console.log('pas de token fourni')
    //   return res.sendStatus(401);
    // }
  // console.log("ping")
    jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err)
        return res.sendStatus(401);
      }
      // console.log("pong")
      req.user = user;
      next();
    });
  }
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmZiOGNlMjc2NjAzZTI3MDFkNzJkYmYiLCJlbWFpbCI6IjEyM0BvdXRsb29rLmZyIiwicGFzc3dvcmQiOiIkMmIkMTAkLnV5TElsSGprUkVHc3JCOW1UN0VGLmc1ZE1pV2ZCVVpaMWRUb0Q2OHh3M3F4azBNYU9nODYiLCJfX3YiOjAsImlhdCI6MTY2MDk1Mzk3OCwiZXhwIjoxNjYwOTU1Nzc4fQ.6reYU6XGDcGVJNSr5txWcjMivOxHHJYzpVjOKl5_0rk"

module.exports.generateAccessToken = generateAccessToken

module.exports.authenticateToken = authenticateToken