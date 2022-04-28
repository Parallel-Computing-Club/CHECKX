const express = require('express');
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const redis = require('redis');
const client  = redis.createClient();
const redisStore = require('connect-redis')(session);
const app = express();
const request = require('request');
const fs = require("fs");
const sample = require("./public/round1json/sample.json");
const http = require('http');

// const oneDay = 1000 * 60 * 60 * 24;

// app.use(session({
//     secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//     saveUninitialized:true,
//     cookie: { maxAge: oneDay },
//     resave: false 
// }));
http://143.110.181.23/
app.use(session({
    secret: 'ssshhhhh',
    store: new redisStore({ host: 'http://143.110.181.23/', port: 6390, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
}));

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.use(express.static('public'));

mongoose.connect(
    `mongodb+srv://avi:ag_1022000_@cluster0.y0fpc.mongodb.net/pcc-project?retryWrites=true&w=majority`,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }
).then(()=>console.warn('Database connection is done'));


const usersSchema = {
    username : String,
    rollno : String,
    arr1: Array,
    temparr : Array,
    questiondone : Array,
    score1 : Number,
    score2 : Number,
    round1done : Number,
    round2done : Number,
    questionno : Number
}


const User = mongoose.model('User',usersSchema);


app.get('/',(req,res) => {

    User.find({}, (err, foundUsers) => {
        
        function sortByProperty(property){  
            return function(a,b){  
               if(a[property] < b[property])  
                  return 1;  
               else if(a[property] > b[property])  
                  return -1;  
           
               return 0;  
            }  
         }

        foundUsers.sort(sortByProperty("score2")); 
        // console.log(foundUsers);
        res.render(`${__dirname}/Client/indexfront.ejs`,{
            users : foundUsers
        });
    })
});



app.get('/login',(req,res) => {
    res.render(`${__dirname}/Client/login.ejs`);
});


app.post('/login', async(req, res) => {
    try{
        // const username = req.body.username;
        // const rollno = req.body.rollno;

        const username = req.body.username;
        const rollno = req.body.rollno;

        // const name = await User.findOne({username:username});
        const name = await User.findOne({username:username});

        if (!name){
            // no result
            req.session.username = username;
            req.session.rollno = rollno;

            let newuser = new User({
                username : username,
                rollno : rollno,
                arr1 : [],
                temparr : [],
                questiondone : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                score1 : Number(0),
                score2 : Number(0),
                round1done : Number(0),
                round2done : Number(0),
                questionno : Number(-1)
            })

            newuser.save();

            res.redirect('/logout');
        }
        else{
            // do something with result
            if(name.rollno === rollno){
                req.session.username = username;
                req.session.rollno = rollno;

                res.redirect('/logout');
            }
            else{
                res.send("Roll No. doesn't match");
            }
        }
    }
    catch(error){
        res.status(400).send("Invalid Username");
    }
});


app.get('/logout',(req,res) => {
    res.render(`${__dirname}/Client/indexfrontlogout.ejs`);
});

app.get('/logoutbutton',(req,res) => {
    // console.log(req.session.username)
    // console.log(req.session.rollno)
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

app.get('/round1',async(req,res) => {
    // Apr 20, 2022 12:00:00
    // Apr 16, 2022 01:01:00
    // console.log(new Date("Apr 16, 2022 01:01:00"));
    // console.log(new Date());

    // const username = req.session.username;
    const rollno = req.session.rollno;
    
    // const name = await User.findOne({rollno:rollno});

    const name = await User.findOne({rollno:rollno});
    
    if(new Date("Apr 15, 2022 12:00:00") >= new Date()){
        res.render(`${__dirname}/Client/livepage.ejs`);
    }
    else if(name.round1done == 1){
        res.render(`${__dirname}/Client/indexfrontlogout.ejs`)
    }
    else{
        // round1done = 1;
        // name = await User.findOne({rollno:rollno});
        console.log(name);

        if(name.arr1.length != 0 ){
            if(name.temparr.length == name.arr1.length){
                name.round1done == 1;
                name.save();
                return res.redirect('/logout');
            }
        }
        
        console.log(name.arr1);

        if(name.arr1.length == 0){
            let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            name.arr1 = list.sort(() => Math.random() - 0.5);
            console.log(name.arr1);
            // name.save();
        }

        // var questionno = -1;
        name.questionno = -1;
        for (let i = 0; i < name.arr1.length; i++) {
            var element = name.arr1[i];
            if(name.temparr.indexOf(element) == -1){
                name.questionno = element;
                name.temparr.push(element);
                // name.save();
                break;
            }
        }
        name.save();

        res.render(`${__dirname}/Client/indexround1.ejs`,{questionno:name.questionno,ans: "Output Will Show Here",scoreround1:name.score1});
    }
    
});


app.post('/update_score',async(req, res) => {
    try{
        // const username = req.session.username;
        const rollno = req.session.rollno;

        const name = await User.findOne({rollno:rollno});
        
        // console.log(name);
        const index = req.body.index;
        if(name.questiondone[index] == 0){
            name.score1 = name.score1 + Number(req.body.score);
            name.questiondone[index] = 1;
            name.save();
        }
        // console.log(name.score2);
        console.log("score recieved");
        // res.redirect('/round1');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ score: name.score1 }));

        // return {score:name.score1}; 
    }
    catch(error){
        res.status(400).send("Error");
    }
    
});



app.get('/next',async(req, res) => {
    try{
        // const username = req.session.username;
        const rollno = req.session.rollno;
        
        const name = await User.findOne({rollno:rollno});
        console.log(name);
        
        if(name.temparr.length == name.arr1.length){
            name.round1done = 1;
            name.save();
            return res.redirect('/logout');
        }
        else{
            console.log(name.temparr);
            name.questionno = name.arr1[name.arr1.indexOf(name.temparr[name.temparr.length-1])+1];
            name.temparr.push(name.questionno);
            console.log(name.temparr);
            name.save();
        }
        // counter = 0; //****-----------------see-----------------****
        // ans = "Output Will Show Here";
        res.render(`${__dirname}/Client/indexround1.ejs`,{questionno:name.questionno,ans:"Output Will Show Here",scoreround1:name.score1});
    }
    catch(error){
        res.status(400).send("Error");
    }
});


app.post('/round1/next',async(req, res) => {
    try{
        // const username = req.session.username;
        const rollno = req.session.rollno;

        const name = await User.findOne({rollno:rollno});
        
        console.log(name);

        name.score1 = Number(req.body.score1);
        name.save();
        // console.log(name.score2);

        res.redirect('/logout'); //not work , instead of this ajax call back funtion work
    }
    catch(error){
        res.status(400).send("Error");
    }
    
});


app.post('/round1/submit',async(req, res) => {
    try{
        // const username = req.session.username;
        const rollno = req.session.rollno;

        console.log(req.body.score1);
        // score2 = req.body.score2;
        
        const name = await User.findOne({rollno:rollno});
        console.log(name);
        
        name.score1 = Number(req.body.score1);
        name.round1done = 1;
        name.save();
        // console.log(name.score2);

        res.redirect('/logout');
    }
    catch(error){
        res.status(400).send("Error");
    }
    
});




app.get('/round2',async(req,res) => {
    // res.render(__dirname + "/Client/indexwordsearch.ejs", {myWords:myWords});
    // res.render(__dirname + "/Client/indexwordsearch.ejs", {word1:word1,word2:word2,word3:word3});
    
    // const username = req.session.username;
    const rollno = req.session.rollno;
    
    const name = await User.findOne({rollno:rollno});

    if(new Date("Apr 15, 2022 12:00:00") >= new Date()){
        res.render(`${__dirname}/Client/livepage.ejs`);
    }
    else if( name.round1done == 0 || name.round2done == 1){
        res.render(`${__dirname}/Client/indexfrontlogout.ejs`)
    }
    else{
        name.round2done = 1;
        // name = await User.findOne({rollno:rollno});
        name.save();
        console.log(name);

        res.render(__dirname + "/Client/indexwordsearch.ejs", {score1:name.score1});
        // res.render(`${__dirname}/Client/indexwordsearch.ejs`);
    }
    
});


app.post('/round2',async(req, res) => {
    try{
        // const username = req.session.username;
        const rollno = req.session.rollno;
        
        const name = await User.findOne({rollno:rollno});

        name.round2done = 1;

        console.log(req.body.score2);
        // score2 = req.body.score2;

        // name = await User.findOne({rollno:rollno});
        console.log(name);

        name.score2 = Number(req.body.score2);
        name.save();
        // console.log(name.score2);

        res.redirect('/logout');
    }
    catch(error){
        res.status(400).send("Error");
    }
    
});

let port = process.env.PORT;

if(port == null || port == ""){
    port = 3000;
}

app.listen(port);

