const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const bcrypt = require('bcrypt');
const Users = require('./backend/Shémas/Users');
const cors = require('cors');
const token = require("./backend/token");
const jwt = require("jsonwebtoken");


const PORT = 27017;

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(cors());
app.use(express.static('public'));



mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log(err));

app.listen(PORT, ()=>{
    console.log('le serveur est lancé sur le port :'+ PORT )
});


app.post("/login",(req, res) => {
  console.log(req.body);
  const eMail = req.body.eMail;
  const Password = req.body.Password;

  Users.findOne({ eMail: eMail }, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      if (data) {
        bcrypt.compare(Password, data.Password, (err, result) => {
          if(err){
            console.log(err);
            res.send(err);
          }else{
            console.log(result);
          if ( result === true ) {
            const accessToken = token.generateAccessToken(data);
              res.send({
                msg:"user connected",
                token : accessToken
            });
           }else{
            res.send({msg:"Mauvais Password"});
            console.log("Mauvais Password");
          }
        }
        });
      }
    }
  });
});

  app.post("/SignUp", (req, res) => {
    console.log(req.body);
    let eMail = req.body.eMail;
    let Password = req.body.Password;
    let Name = req.body.Name;
    const saltRounds = 10;
  
    Users.findOne({ eMail : eMail }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data) {
          if (data.eMail === eMail) {
            console.log("Le mail est déjà utilisé ");
            res.send({ message: "Le mail est déjà utilisé " });
          }
        } else {
          bcrypt.hash(Password, saltRounds, (err, hash) => {
            
            const newUser = new Users({
              eMail: eMail,
              Password: hash,
              Name: Name,
        
            });
            newUser.save((err) => {
              if (err) {
                console.log(err);
              } else {
                res.send({ message: "Utilisateur enregistré" });
              }
            });
          });
        }
      }
    });
  });

  app.get("/ListeUtilisateurs",token.authenticateToken,(req,res)=>{
    console.log(req.headers.authorization);
      Users.find({},(err,data)=>{
        if(err){
          console(err);
          res.send(err);
        }else{
          let Names=[];
          for(let i=0;i<data.length;i++){
            Names[i]=data[i].Name;
            console.log("enregistré");
          }
          res.send({userList:Names});
        }

      })


  });