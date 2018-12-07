const express = require('express');  //express
const cp = require('cookie-parser'); //cookie parser
const bodyParser = require('body-parser'); //body parser
const session = require('express-session'); //session cookie
//const NodeCouchDB = require('node-couchdb');
const nano = require('nano')('http://localhost:5984'); //using nano to connect to couchdb
const bcrypt = require('bcrypt');  //for encrypting passwords
var cors=require('cors');
const mqtt = require('mqtt');
const broker = 'mqtt://broker.hivemq.com';

const bin_table = {
    "muweilih-001": {
        "lat": 25.311,
        "lng": 55.4919
    }
};

//const path = require('path');
const fs = require('fs'); //file system

const app = express();


app.use(cors({origin:true,credentials: true}));
app.use(bodyParser.json());
//const couch = new NodeCouchDB();

// couch.listDatabases().then(function(dbs){
//     console.log(dbs);
// });

//const dbname = 'greencity';
const pins = nano.db.use('greencity'); //using an existing database for pin locations set by users

const users = nano.db.use('greencity_users'); //using an existing database for green city users

const bins = nano.db.use('greencity_bins'); //using an existing database for greencity bin locations and status

const salt_rounds = 15;

app.use(bodyParser.urlencoded({ extended: false })); //setting body parser



app.use(express.static(__dirname + '/public/')); //setting directory name
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');
app.set('port', process.env.PORT || 3000); //setting port
app.use(cp());                             //setting cookie parser
app.use(session({ secret: "Shh, its a secret!" }))  //secret to hash session cookies

//route for sending session username
app.get('/getUsername', function (req, res) {
    res.send(req.session.username);
});

//mqtt section
var mqtt_client = mqtt.connect(broker); //connect to the broker
mqtt_client.subscribe('bins/sharjah/muweilih'); //subscribe to a bin and its readings

// mqtt_client.on('message', (topic, payload) => { //callback for when we receive a message
//     console.log(`message from ${topic}:- ${payload}`);  
//     var bin_received = JSON.parse(payload); 
//     var coords = bin_table[bin_received.bin_ID]; 
//     bins.insert({bin_id:bin_received.bin_ID,lat:coords.lat,lng:coords.lng, temperature:bin_received.temp, proximity: bin_received.proximity, gas:"Np"}).then((body)=>{
//         console.log(body);
//     });
// });


const litteredPlaces = nano.use('littered_places'); //using the littered_places database

app.post('/placepins',(req,res)=>{  //route to place a new pin in the database
    console.log(req.body);
    litteredPlaces.insert({coordinates:{lat:Number(req.body.lat),lng:Number(req.body.lng)}}).then((body)=>{
        console.log(body);
        res.status(200).send('Inserted');   //response that pin has been placed
    });
});

//route for when a user attempts to login 
app.post('/loginAttempt', function (req, res) {
    //key to check for usernames 
    users.view('all_users', 'all', { include_docs: false, key: req.body.username }).then(body => {
        if (body.rows.length) {
            //console.log(body.rows[0].value) returns the hashed password from the db
            //comparing user entered password with hashed password
            bcrypt.compare(req.body.password, body.rows[0].value, (err, success) => {
                if (err) {
                    //sending an error message         
                    res.status(500).send("Error logging in");
                    console.log("Error logging in");

                } else if (success) {
                    //if password in db is correct 
                    //redirecting to dashboard route and starting session
                    console.log('Compared successfully');
                    req.session.username = req.body.username;
                    res.status(200).json({response:'success'});
                } else {
                    //wrong Password entered 
                    res.status(500).send('Wrong Password');
                    console.log("Wrong Password");

                }
            });
        } else {
            //user not found in the database
            res.status(404).send("User not found, please register first!")
            console.log("User not found ");
        }

    }).catch(err => {
        res.status(500).send("Cannot access database") //database is down
    });

});

//route for when a user attempts to register
app.post('/registerAttempt', function (req, res) {
    var email = req.body.email;
    var user = req.body.username;
    var pass = req.body.password;
    var loc = req.body.location;

    console.log(email);
    console.log(user);
    console.log(pass);
    console.log(loc);

    //hashing the users password using bcrypt
    bcrypt.hash(pass, salt_rounds, async function (err, hash) {
        if (!err) {
            try {
                //inserting into database
                await users.insert({
                    "email": email,
                    "username": user,
                    "password": hash,
                    "location": loc,
                }, null);  //null generates id
                res.status(200).json({response:'LoggedIn'});  //redirecting to login page after successful registration
            } catch (err) {
                console.log(err);
                res.status(500).send("Registration Error"); //registration error
            }
        }
        else {
            console.log(err);
            res.status(500).send("Registration Error"); //registration error
        }
    });
});

//sign out route
app.get('/signout', function(req,res){
    req.session.destroy((err)=>{
        if(err){
            console.log('Log out Error');
            res.status(500).send("Log out Error"); //log out error
        }
        else{
            console.log('Log out successful');
            res.status(200).json({response:'success'})  //redirect to home page
        }

    });
});

//get pins route - gets pins from couchdb
app.get('/getpins', (req, res) => {
    console.log('Received a request from :' + req.hostname);
    var gotPins = [];
    //views
    pins.view('all_locations', 'all').then(body => {
        body.rows.forEach(doc => {
            //console.log(doc)
            //console.log(doc.value.lat);
            //storing values from couchdb in an array
            gotPins.push({ name: doc.value.name, time: doc.value.time, address: doc.value.address, lat: doc.value.lat, lng: doc.value.lng, count: doc.value.count });
        });
        //console.log(gotPins); //array of latitude and longitude positions
        res.status(200).json(gotPins);  //response json object of array
    });
});

//get bins route
app.get('/getbins', (req, res) => {
    console.log('Received a request from :' + req.hostname);
    var gotBins = [];
    var type = '';
    //views
    bins.view('all_bins', 'bins').then(body => {
        body.rows.forEach(doc => {
            //console.log(doc.value.lat);
            //storing values from couchdb in an array
            // if (bin.proximity >200)
            // {
            //   type= '../assets/img/redbin.png';
            // }
            // else type= '../assets/img/greenbin.png';
            gotBins.push({ binid: doc.value.binid, time: doc.value.time, temperature: doc.value.temperature, gas: doc.value.gas, proximity: doc.value.proximity, lat: doc.value.lat, lng: doc.value.lng });
            // gotBins.push(doc.value);

            // console.log(doc.value);
        });
        //console.log(gotBins);
        res.status(200).json(gotBins);  //response json object of array
    });
});



// custom 404 page
app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// custom 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');

});