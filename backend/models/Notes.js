const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    //I will add another model field which is user is : we will store id here
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },

    title : {
        type:String,
        required:true
      
    },

    desc : {
        type:String,
        required:true
    },

    tag : {
        type:String,
        default:"General"
    },

    date : {
        type:Date,
        default:Date.now
    }
})


// create model user with the help of this schema
module.exports = mongoose.model("note", NoteSchema);    