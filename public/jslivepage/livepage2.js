// let countDownDate = new Date("May 14, 2022 19:50:00").getTime();
let countDownDate = new Date("Jul 14, 2022 19:50:00").getTime();


let counter = setInterval(() => {
    // Get Date Now
    let dateNow = new Date().getTime();

    // Find The Date Difference Between Now And Countdown Date
    let dateDiff = countDownDate - dateNow;

    // Get Time Units
    let days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((dateDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((dateDiff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((dateDiff % (1000 * 60)) / 1000);

    document.getElementById("day").innerHTML = days < 10 ? `0${days}` : days;
    document.getElementById("hour").innerHTML = hours < 10 ? `0${hours}` : hours;
    document.getElementById("minute").innerHTML = minutes < 10 ? `0${minutes}` : minutes;
    document.getElementById("second").innerHTML = seconds < 10 ? `0${seconds}` : seconds;
    

    if (dateDiff <= 0) {
        window.location.href = '/logout';
    }
}, 1000);