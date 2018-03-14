// Require the Express Module
var express = require('express');

// Require the Mongoose Module
var mongoose = require('mongoose');

// Create an Express App
var app = express();

// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');

// Integrate body-parser with our App
app.use(bodyParser.json());

// Require path
var path = require('path');

// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));

// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));

mongoose.connect('mongodb://localhost/api_1955');

// define Schema variable
var Schema = mongoose.Schema;

var PeopleSchema = new mongoose.Schema({
    name:  { type: String, required: [true, "Name is required"], minlength: [3, "Name must be at least 3 characters long"] }
}, {timestamps: true });

// set our models by passing them their respective Schemas
mongoose.model('People', PeopleSchema);

// store our models in variables
var People = mongoose.model('People');

// Routes
// Root Request
app.get('/', function(req, res) {
    People.find({ }, function(err, people) {         
        if(err) {
            console.log("Returned error", err);
            // respond with JSON
            res.json({message: "Error", error: err});
        }else{
            // respond` with JSON
            res.json({message: "Success", data: people});
        }
    });
});

app.get('/new/:name', function(req, res) {
    var person = new People({ name: req.params.name });

    person.save(function(err) {
        if(err) {
            console.log('Something went wrong, could not save: '+req.params.name);
            console.log("Returned error", err);
            res.json({message: "Error", error: err});
        } else {
            // respond` with JSON
            res.json({message: "Success", data: person});
        }
    });
});


app.get('/remove/:name', function(req, res){
    People.remove({ name: req.params.name }, function(err, person) {
        if(err){
            console.log('something went wrong, could not remove: '+req.params.name);
            console.log("Returned error", err);
            res.json({message: "Error", error: err});
        }else{
            console.log('successfully deleted a person!');
            res.json({message: "Success", data: person});
        }
    });
});

app.get('/:name', function(req, res){
    People.find({ name: req.params.name }, function(err, person) {
        if(err) {
            console.log('something went wrong, could not display: '+req.params.name);
            console.log("Returned error", err);
            res.json({message: "Error", error: err});
        } else {
            console.log('successfully deleted a person!');
            res.json({message: "Success", data: person});
        }
    });
});

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});