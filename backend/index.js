const express = require("express");
const connectToMongo = require("./db");
const authRoute = require("./routes/auth.js");
const notesRoute = require("./routes/notes.js");

connectToMongo();


const app = express();


// To get access of body data in form of json you need to use this middleware

app.use(express.json());

//available routes
app.use("/api/auth",authRoute)
app.use("/api/note",notesRoute)

app.get("/", (req, res)=>{
    res.status(200).send("Hellow home page ");
})
app.listen(8080, ()=>{
    console.log("Server is running on port number 8080")
})