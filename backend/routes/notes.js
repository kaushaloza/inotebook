const express = require("express");
const {body, validationResult} = require("express-validator");
const router = express.Router();
const fetchuser = require("../middlewares/fetchuser.js");
const Notes = require("../models/Notes.js");

//ROUTE 1: GET ALL THE NOTES
//fetching user notes : single user all notes
 router.get("/fetchnotes",fetchuser, async (req, res) => {
        const notes = await Notes.find({user:req.user.id});

        res.json(notes);
    })

    //ROUTE 2: Add a new note
 router.get("/addnote",fetchuser,[
     body("title", "Enter a valid title").isLength({min:3}),
     body("desc", "Enter a valid desc (at least 10 characters").isLength({min:10})

     
 ] , async (req, res) => {
    try {
    const {title, desc, tag} = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array() });
    }

        const note = await new Notes({
            title,desc,tag, user:req.user.id
        })

        const savedNote = await note.save();
        res.json(savedNote);


    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong from server side")
    }

})

    //ROUTE 3: update note

    router.put("/updatenote/:id",fetchuser, async (req, res) => {

        const {title, desc, tag} = req.body

        const newNote = {};
        if(title){
            newNote.title = title  
        }
        if(desc){
            newNote.desc = desc  
        }
        if(tag){
            newNote.tag = tag  
        }

        //FIND THE NOTE TO BE UPDATED

        //params means id in url
        let note = await  Notes.findById(req.params.id)

        if(!note){
            return res.status(404).send("Not found");
        }

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set : newNote}, {new:true})
        res.send(note);



    })
   
       
    // ROUTE 4 : DELETE THE NOTE

    router.delete("/deletenote/:id", fetchuser, async (req, res) => {
        try{
        // FIND THE NOTE TO BE DELETED

        let note = await Notes.findById(req.params.id);

        if(!note){
            res.status(404).send("Not found")
        }

        //CHECK THE USER IS CORRECT OR NOT

        if(note.user.toString() !== req.user.id){
            res.status(401).send("Not allowed")
        }

        note = await Notes.findByIdAndDelete(req.user.id);

        res.json("Note has been deleted");

    }catch(err){
        res.json(500).send("Error from server side");
    }
    })




module.exports = router;