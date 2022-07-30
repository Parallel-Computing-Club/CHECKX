const express = require("express");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const request = require("request");

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
    const password = req.body.password;
    const rollno = req.body.rollno;

    const BASE = "http://main.pcc.events/";

    const url = BASE + "centralized/" + rollno + "/" + password;

    let obj, data, final;

    User.find({}, (err, foundUsers) => {
        function sortByProperty(property) {
          return function (a, b) {
            if (a[property] < b[property]) return 1;
            else if (a[property] > b[property]) return -1;
    
            return 0;
          };
        }
        final = foundUsers.sort(sortByProperty("totalscore"));
    });

    request.post(
        url, 
        async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                obj = JSON.parse(body);
                data = JSON.parse(obj);

                if (data["status"]) {
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
  if (req.session.rollno && req.cookies.user_sid) {
    const rollno = req.session.rollno;
    const name = await User.findOne({ rollno: rollno });

    var today = new Date();
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);

    // new Date("May 14, 2022 18:00:00") >= today && rollno != 205321004
    if (new Date("Jul 14, 2022 18:00:00") >= today && rollno != 205321004) {
      res.render(`${__dirname}/Client/livepage1.ejs`);
    }

    // (new Date("May 14 , 2022 19:30:00") <= today || name.round1done == 1) && rollno != 205321004
    else if ((new Date("Jul 14 , 2022 19:30:00") <= today || name.round1done == 1)&& rollno != 205321004) {
      res.render(`${__dirname}/Client/indexfrontlogout.ejs`);
    } else {

      if (name.arr1.length != 0) {
        if (name.temparr.length == name.arr1.length) {
          name.round1done == 1;
          name.save();
          return res.redirect("/logout");
        }
      }

      if (name.arr1.length == 0) {
        let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        name.arr1 = list.sort(() => Math.random() - 0.5);
      }

      name.questionno = -1;
      for (let i = 0; i < name.arr1.length; i++) {
        var element = name.arr1[i];
        if (name.temparr.indexOf(element) == -1) {
          name.questionno = element;
          name.temparr.push(element);
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
      const rollno = req.session.rollno;
      const name = await User.findOne({ rollno: rollno });
      
      const index = req.body.index;
      if (name.questiondone[index] == 0) {
        name.score1 = name.score1 + Number(req.body.score);
        name.questiondone[index] = 1;
        name.save();
      }

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ score: name.score1 }));
    } catch (error) {
      res.status(400).send("Error");
    }
  }
});

app.get("/next", async (req, res) => {
  if (req.session.rollno && req.cookies.user_sid) {
  try {
    const rollno = req.session.rollno;
    const name = await User.findOne({ rollno: rollno });

    if (name.temparr.length == name.arr1.length) {
      name.totalscore += (0.70 * name.score1);
      name.round1done = 1;
      name.save();
      return res.redirect("/logout");
    } 
    else{
      name.questionno =
        name.arr1[name.arr1.indexOf(name.temparr[name.temparr.length - 1]) + 1];
      name.temparr.push(name.questionno);
      name.save();
    }
    
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
    const rollno = req.session.rollno;
    const name = await User.findOne({ rollno: rollno });

    name.score1 = Number(req.body.score1);
    name.save();

    res.redirect("/logout"); //not work , instead of this ajax call back funtion work
  } catch (error) {
    res.status(400).send("Error");
  }
}
});

app.post("/round1/submit", async (req, res) => {
  if (req.session.rollno && req.cookies.user_sid) {
  try {
    const rollno = req.session.rollno;
    const name = await User.findOne({ rollno: rollno });

    name.score1 = Number(req.body.score1);
    name.totalscore += (0.70 * name.score1);
    name.round1done = 1;
    name.save();

    res.redirect("/logout");
  } catch (error) {
    res.status(400).send("Error");
  }
}
});

app.get("/round2", async (req, res) => {
  if (req.session.rollno && req.cookies.user_sid) {
    const rollno = req.session.rollno;
    const name = await User.findOne({ rollno: rollno });
    
    var today = new Date();
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);
    
    // new Date("May 14, 2022 19:50:00") >= today && rollno != 205321004
    if (new Date("Jul 14, 2022 19:50:00") >= today && rollno != 205321004) {
      res.render(`${__dirname}/Client/livepage2.ejs`);
    }
    // (new Date("May 14, 2022 20:00:00") <= today || name.round1done == 0 || name.round2done == 1)&& rollno != 205321004
    else if ((new Date("Jul 14, 2022 20:00:00") <= today || name.round1done == 0 || name.round2done == 1)&& rollno != 205321004) {
      res.render(`${__dirname}/Client/indexfrontlogout.ejs`);
    } else {
      name.round2done = 1;
      name.save();

      res.render(__dirname + "/Client/indexwordsearch.ejs", {
        score1: name.score1,
      });
    }
  }
});

app.post("/round2", async (req, res) => {
  if (req.session.rollno && req.cookies.user_sid) {
  try {
    const rollno = req.session.rollno;
    const name = await User.findOne({ rollno: rollno });
    
    name.round2done = 1;
    name.score2 = Number(req.body.score2);
    name.totalscore += (0.30 * name.score2);
    name.save();

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
