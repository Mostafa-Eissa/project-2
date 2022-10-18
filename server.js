// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

//allow to manage corss-origin
const cors = require("cors");

//Cors for cross origin allowanc
app.use(cors());

// Here we are configuring express to use body-parser as middle-ware.
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


// Initialize the main project folder
app.use(express.static("website"));

//Callback function to complete GET '/all'

app.get("/all", function (req, res) {
    res.send(projectData).status(200);
});

//post data
app.post("/addData", function (req, res) {
    projectData = req.body;
    console.log(projectData);
    res.send(projectData).status(200);
})

const port = 8888;
// test server
app.listen(port, function(){
    console.log(`http://localhost:${port}`);
})
