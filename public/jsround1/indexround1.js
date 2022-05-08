$(document).ready(function () {
    $("#next").click(function () {
    $.post("/round1/next",
            {
                score1: $('.scorep').text()
            },
            function (res) {
                window.location.href = '/next';
            }
            );
    });
});


$(document).ready(function () {
    $("#submit").click(function () {
    $.post("/round1/submit",
            {
                score1: $('.scorep').text()
            },
            function (res) {
                window.location.href = '/logout';
            }
            );
    });
});






// The End Of The Year Date To Countdown To
// 1000 milliseconds = 1 Second

let countDownDate = new Date("May 9, 2022 21:30:00").getTime();
// let countDownDate = new Date().getTime() + (90*60*1000);
// console.log(countDownDate);

let counter = setInterval(() => {
    // Get Date Now
    let dateNow = new Date().getTime();

    // Find The Date Difference Between Now And Countdown Date
    let dateDiff = countDownDate - dateNow;

    // Get Time Units
    // let days = Math.floor(dateDiff / 1000 / 60 / 60 / 24);
    let days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((dateDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((dateDiff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((dateDiff % (1000 * 60)) / 1000);

    document.querySelector(".day").innerHTML = days < 10 ? `0${days}` : days;
    document.querySelector(".hour").innerHTML = hours < 10 ? `0${hours}` : hours;
    document.querySelector(".minute").innerHTML = minutes < 10 ? `0${minutes}` : minutes;
    document.querySelector(".second").innerHTML = seconds < 10 ? `0${seconds}` : seconds;
    

    if (dateDiff < 0) {
        document.getElementById("submit").click();
        // console.log("ENDED");
        // window.location.reload();
        // clearInterval(counter);
    }
}, 1000);


// var randomNumber = Math.floor(Math.random()*10);
// var ans;

// fetch("round1json/data.json")
//     .then(response => response.json())
//     .then(data => {
//         //console.log(data[randomNumber].question);
//         // console.log(typeof(data[0].difficulty));
//         // console.log(typeof(data[0].description));
//         // console.log(typeof(data[0].wrongcode));
//         document.getElementById("difficulty").innerHTML = data[0].difficulty;
//         document.getElementById("description").innerHTML = data[0].description;
//         document.getElementById("wrongcode").innerHTML = data[0].wrongcode;
//         // console.log("yoo");
//         //console.log(data[randomNumber].answer);
//         // ans = data[randomNumber].answer;
//     });




    // console.log(JSON.parse("<%= data %>"));


    // <!-- <%= description %> -->
    // <!-- <%= wrongcode %> -->
    // <%= difficulty %>

    // console.log(typeof("<%= difficulty %>"));
        // console.log(typeof("<%= description %>"));
        // console.log(typeof("<%= wrongcode %>"));
        // document.getElementById("difficulty").innerHTML = "<%= difficulty %>";
        // document.getElementById("description").innerHTML = "<%= description %>";
        // document.getElementById("wrongcode").innerHTML = "<%= description %>";




// fs.readFile("data.json","utf-8",(err,data)=>{
    //     console.log(data[0]);
    // });

    // var rawdata = fs.readFileSync('data.json');
    // var data = JSON.parse(rawdata);
    // // console.log(data[0].description);
    // var difficulty = data[0].difficulty;
    // var description = data[0].description;
    // var wrongcode = data[0].wrongcode;

    // fetch("data.json")
    //     .then(response => response.json())
    //         .then(data => {
    //             console.log(data[0]);
    //             //console.log(data[randomNumber].question);
    //             // document.getElementById("difficulty").innerHTML = data[0].difficulty;
    //             // document.getElementById("description").innerHTML = data[0].description;
    //             // document.getElementById("wrongcode").innerHTML = data[0].wrongcode;
    //             // console.log("yoo");
    //             //console.log(data[randomNumber].answer);
    //             // ans = data[randomNumber].answer;
    //     });
    //{difficulty:difficulty,description:description,wrongcode:wrongcode}
    // {difficulty:difficulty,description:description,wrongcode:wrongcode}
    // JSON.stringify({key:"value"})
    // {data:data[0]}