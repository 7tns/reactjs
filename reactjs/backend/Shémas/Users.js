
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creation du shéma User pour ensuite avoir un modéle de ce type ;

const UsersSchema = new Schema({
    Name:  String,
    eMail: String,
    Password: String,
  });
 

const Users =  mongoose.model('Student', UsersSchema)

module.exports = Users