const express = require("express");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
// const mongoose = require("./connectivityCode.js");
const bodyParser = require("body-parser");
// const redis = require("redis");
// const client = redis.createClient();
// const redisStore = require("connect-redis")(session);
const app = express();
const request = require("request");
// const fs = require("fs");
// const sample = require("./public/round1json/sample.json");
// const http = require("http");
// const { strict } = require("assert");
const console = require("console");
// var popup = require('popups');
// let alert = require('alert'); 

// const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
  key: 'user_sid',
  secret: "thisismysecrctekey",
  resave: true,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 1*60*60*1000*48
  }
}));

function calcTime(city, offset) {
  // create Date object for current location
  var d = new Date();

  // convert to msec
  // subtract local time zone offset
  // get UTC time in msec
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

  // create new Date object for different city
  // using supplied offset
  var nd = new Date(utc + (3600000*offset));

  // return time as a string
  return nd;
}

// alert(calcTime('Bombay', '+5.5'));

// app.use(session({
//     secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//     saveUninitialized:true,
//     cookie: { maxAge: oneDay },
//     resave: false
// }));

// http://143.110.181.23/
// 6390
// app.use(
//   session({
//     secret: "ssshhhhh",
//     store: new redisStore({
//       host: "localhost",
//       // host: "http://143.110.181.23/",
//       // port: 6390,
//       port: 6379,
//       client: client,
//       ttl: 260,
//     }),
//     saveUninitialized: false,
//     resave: false,
//   })
// );

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(cookieParser());


mongoose
  .connect(
    `mongodb+srv://avi:ag_1022000_@cluster0.y0fpc.mongodb.net/pcc-project?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    // 'mongodb://127.0.0.1/pcc-project'
  )
  .then(() => console.warn("Database connection is done"));

const usersSchema = {
  username: String,
  rollno: String,
  arr1: Array,
  temparr: Array,
  questiondone: Array,
  score1: Number,
  score2: Number,
  round1done: Number,
  round2done: Number,
  questionno: Number,
  totalscore:Number
};

const User = mongoose.model("User", usersSchema);

app.get("/", (req, res) => {
  User.find({}, (err, foundUsers) => {
    function sortByProperty(property) {
      return function (a, b) {
        if (a[property] < b[property]) return 1;
        else if (a[property] > b[property]) return -1;

        return 0;
      };
    }

    foundUsers.sort(sortByProperty("totalscore"));
    // console.log(foundUsers);
    res.render(`${__dirname}/Client/indexfront.ejs`, {
      users: foundUsers, alert : false
    });
  });
});

app.get("/login", (req, res) => {
  res.render(`${__dirname}/Client/login.ejs`);
});


app.post("/login", async (req, res) => {
  try {
    // req.session.rollno = rollno;
    const password = req.body.password;
    const rollno = req.body.rollno;
    // var username;

    const BASE = "http://main.pcc.events/";

    const url = BASE + "centralized/" + rollno + "/" + password;
    // console.log(url);

    let obj, data;
    // let final;
    let final;
    User.find({}, (err, foundUsers) => {
        function sortByProperty(property) {
          return function (a, b) {
            if (a[property] < b[property]) return 1;
            else if (a[property] > b[property]) return -1;
    
            return 0;
          };
        }
        console.log(final);
        final = foundUsers.sort(sortByProperty("totalscore"));
    });

    request.post(
        url, 
        async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                obj = JSON.parse(body);
                data = JSON.parse(obj);
                
                console.log(data);

                if (data["status"]) {
                    // console.log("yoo");
                    const username = data["userName"];
            
                    const name = await User.findOne({ rollno: rollno });
            
                    if (!name) {
                        // no result
                        req.session.username = username;
                        req.session.rollno = rollno;
            
                        let newuser = new User({
                        username: username,
                        rollno: rollno,
                        arr1: [],
                        temparr: [],
                        questiondone: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        score1: Number(0),
                        score2: Number(0),
                        round1done: Number(0),
                        round2done: Number(0),
                        questionno: Number(-1),
                        totalscore:Number(0)
                        });
            
                        newuser.save();
            
                        return res.redirect("/logout");
                    } else {
                        // do something with result
                        if (name.rollno === rollno) {
                            req.session.username = username;
                            req.session.rollno = rollno;
                
                            return res.redirect("/logout");
                        } 
                        else {
                            return res.render(`${__dirname}/Client/indexfront.ejs`, {
                                users: final,alert : true
                              });
                        
                        }
                    }
                }else{
                    return res.render(`${__dirname}/Client/indexfront.ejs`, {
                        users: final,alert : true
                      });
                }
                
            }
    });
 } catch (error) {
    console.log(error);
    return res.status(400).send("Invalid Username");
  }
});

app.get("/logout", (req, res) => {
  res.render(`${__dirname}/Client/indexfrontlogout.ejs`);
});

app.get("/logoutbutton", (req, res) => {
  // console.log(req.session.username)
  // console.log(req.session.rollno)
  if (req.session.rollno && req.cookies.user_sid) {
    req.session.rollno={};
    res.clearCookie('user_sid');
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.redirect("/");
    });
  }
});

app.get("/round1", async (req, res) => {
  // Apr 20, 2022 12:00:00
  // Apr 16, 2022 01:01:00
  // console.log(new Date("Apr 16, 2022 01:01:00"));
  // console.log(new Date());

  // const username = req.session.username;
  if (req.session.rollno && req.cookies.user_sid) {
    const rollno = req.session.rollno;
    console.log(rollno);
    // const name = await User.findOne({rollno:rollno});

    const name = await User.findOne({ rollno: rollno });
    console.log(new Date());

    if (new Date("May 9, 2022 22:00:00") >= calcTime('Bombay', '+5.5') ) {
      res.render(`${__dirname}/Client/livepage1.ejs`);
    }
    else if (new Date("May 9, 2022 23:30:00") <= calcTime('Bombay', '+5.5') || name.round1done == 1) {
      res.render(`${__dirname}/Client/indexfrontlogout.ejs`);
    } else {
      // round1done = 1;
      // name = await User.findOne({rollno:rollno});
      console.log(name);

      if (name.arr1.length != 0) {
        if (name.temparr.length == name.arr1.length) {
          name.round1done == 1;
          name.save();
          return res.redirect("/logout");
        }
      }

      console.log(name.arr1);

      if (name.arr1.length == 0) {
        let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        name.arr1 = list.sort(() => Math.random() - 0.5);
        console.log(name.arr1);
        // name.save();
      }

      // var questionno = -1;
      name.questionno = -1;
      for (let i = 0; i < name.arr1.length; i++) {
        var element = name.arr1[i];
        if (name.temparr.indexOf(element) == -1) {
          name.questionno = element;
          name.temparr.push(element);
          // name.save();
          break;
        }
      }
      name.save();

      res.render(`${__dirname}/Client/indexround1.ejs`, {
        questionno: name.questionno,
        ans: "Output Will Show Here",
        scoreround1: name.score1,
      });
    }
  }
});

app.post("/update_score", async (req, res) => {
  
  if (req.session.rollno && req.cookies.user_sid) {
    try {
      // const username = req.session.username;
      
      const rollno = req.session.rollno;
      console.log(rollno);

      const name = await User.findOne({ rollno: rollno });

      // console.log(name);
      const index = req.body.index;
      if (name.questiondone[index] == 0) {
        name.score1 = name.score1 + Number(req.body.score);
        name.questiondone[index] = 1;
        name.save();
      }
      // console.log(name.score2);
      console.log("score recieved");
      // res.redirect('/round1');
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ score: name.score1 }));

      // return {score:name.score1};
    } catch (error) {
      res.status(400).send("Error");
    }
  }
});

app.get("/next", async (req, res) => {
  if (req.session.rollno && req.cookies.user_sid) {
  try {
    // const username = req.session.username;
    const rollno = req.session.rollno;
    console.log(rollno);

    const name = await User.findOne({ rollno: rollno });
    console.log(name);

    if (name.temparr.length == name.arr1.length) {
      name.totalscore += (0.70 * name.score1);
      name.round1done = 1;
      name.save();
      return res.redirect("/logout");
    } else {
      console.log(name.temparr);
      name.questionno =
        name.arr1[name.arr1.indexOf(name.temparr[name.temparr.length - 1]) + 1];
      name.temparr.push(name.questionno);
      console.log(name.temparr);
      name.save();
    }
    // counter = 0; //****-----------------see-----------------****
    // ans = "Output Will Show Here";
    res.render(`${__dirname}/Client/indexround1.ejs`, {
      questionno: name.questionno,
      ans: "Output Will Show Here",
      scoreround1: name.score1,
    });
  } catch (error) {
    res.status(400).send("Error");
  }
 }
});

app.post("/round1/next", async (req, res) => {
  if (req.session.rollno && req.cookies.user_sid) {
  try {
    // const username = req.session.username;
    const rollno = req.session.rollno;
    console.log(rollno);

    const name = await User.findOne({ rollno: rollno });

    console.log(name);

    name.score1 = Number(req.body.score1);
    name.save();
    // console.log(name.score2);

    res.redirect("/logout"); //not work , instead of this ajax call back funtion work
  } catch (error) {
    res.status(400).send("Error");
  }
}
});

app.post("/round1/submit", async (req, res) => {
  if (req.session.rollno && req.cookies.user_sid) {
  try {
    // const username = req.session.username;
    const rollno = req.session.rollno;
    console.log(rollno);

    console.log(req.body.score1);
    // score2 = req.body.score2;

    const name = await User.findOne({ rollno: rollno });
    console.log(name);

    name.score1 = Number(req.body.score1);
    name.totalscore += (0.75 * name.score1);
    name.round1done = 1;
    name.save();
    // console.log(name.score2);

    res.redirect("/logout");
  } catch (error) {
    res.status(400).send("Error");
  }
}
});

app.get("/round2", async (req, res) => {
  // res.render(__dirname + "/Client/indexwordsearch.ejs", {myWords:myWords});
  // res.render(__dirname + "/Client/indexwordsearch.ejs", {word1:word1,word2:word2,word3:word3});

  // const username = req.session.username;
  if (req.session.rollno && req.cookies.user_sid) {
  const rollno = req.session.rollno;
  console.log(rollno);

  const name = await User.findOne({ rollno: rollno });
  console.log(new Date());

  if (new Date("May 9, 2022 23:45:00") >= calcTime('Bombay', '+5.5')) {
    res.render(`${__dirname}/Client/livepage2.ejs`);
  }
  else if (new Date("May 9, 2022 23:55:00") <= calcTime('Bombay', '+5.5') || name.round1done == 0 || name.round2done == 1) {
    res.render(`${__dirname}/Client/indexfrontlogout.ejs`);
  } else {
    name.round2done = 1;
    // name = await User.findOne({rollno:rollno});
    name.save();
    console.log(name);

    res.render(__dirname + "/Client/indexwordsearch.ejs", {
      score1: name.score1,
    });
    // res.render(`${__dirname}/Client/indexwordsearch.ejs`);
  }
}
});

app.post("/round2", async (req, res) => {
  if (req.session.rollno && req.cookies.user_sid) {
  try {
    // const username = req.session.username;
    const rollno = req.session.rollno;
    console.log(rollno);
    
    const name = await User.findOne({ rollno: rollno });
    name.round2done = 1;
    
    console.log(req.body.score2);
    // score2 = req.body.score2;
    
    // name = await User.findOne({rollno:rollno});
    console.log(name);
    
    name.score2 = Number(req.body.score2);
    name.totalscore += (0.30 * name.score2);
    name.save();
    // console.log(name.score2);

    res.redirect("/logout");
  } catch (error) {
    res.status(400).send("Error");
  }
}
});

let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

app.listen(port);
