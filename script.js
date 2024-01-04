let newGameBtn = document.querySelector(".newGameBtn");
let boxes = document.querySelectorAll(".box");
let images = document.querySelectorAll(".box img");
let heading = document.querySelector(".heading");
let click = document.querySelector(".count");
let greet = document.querySelector(".greet");
let time = document.querySelector(".time");
let clickCount = 1;  //to count the clicks
let numArray = [];   //to store box numbers which is in their id
let srcArray = [];   //to store sources for cards 
let idx = 1;  //image source assignment counter
let id, id2;  // to clear window functions setInterval and setTimeout
let counter = true;  // to stay card on clicked
let img1, img2; //to match the card image
let minClick = 250;
// on hit start btn;
newGameBtn.addEventListener("click", () => {
    reset();
    setEvent();
    gameInit();
    timer();
    click.innerHTML = 0;
    heading.innerHTML = "New Game";
})

//generate random number until numArray not equal to 24
function getRandom() {
    let num = Math.floor(Math.random() * 24) + 1;
    // console.log(numArray); multiple repetition
    if (numArray.length == 24) {
        return 0;
    }
    if (numArray.every(el => el != num)) {
        return num;
    } else {
        return getRandom();
    }
}
//check for element source for all images
function checkEmpty() {
    let condition = [...images].some(el=>el.getAttribute("src") == "");
    if(condition) {
        return 1;
    } else {
        return 0;
    }
}
//for game initializtion and re-initializtion
function gameInit() {
    time.style.width = `100%`;
    let n1, n2;
    while (checkEmpty && getRandom()) {
        n1 = getRandom();
        numArray.push(n1);
        n2 = getRandom();
        numArray.push(n2);
        let box1 = document.querySelector(`#box_${n1}`);
        let box2 = document.querySelector(`#box_${n2}`);
        let imgLink = `./image/image${idx++}.jpeg`;
        if (!srcArray.some(el => el.src == imgLink)) {
            box1.firstChild.src = imgLink;
            box2.firstChild.src = imgLink;
            srcArray.push(imgLink);
        }
    }
}

// create card blink effect
function blink() {
    this.parentElement.classList.add("white");
    this.classList.add("visible");
    let sound = document.querySelector(".flip");
    sound.attributes[0].nodeValue = `./audio/click.mp3`;
    setTimeout(() => {
        this.parentElement.classList.remove("white");
        this.classList.remove("visible");
    }, 250);
    //for total click count
    click.innerHTML = clickCount++;
}


function checkSuccess(img1, img2) {
    let src1 = img1.getAttribute("src");
    let id1 = img1.parentElement.getAttribute("id");
    let src2 = img2.getAttribute("src");
    let id2 = img2.parentElement.getAttribute("id");
    //resist functionality of double click on same element
    if ((id1 == id2)) {
        img1.style.opacity = 0;
        img2.style.opacity = 0;
    } else {
        // match the flip pic
        if (src1 == src2) {
            img1.style.opacity = 1;
            img2.style.opacity = 1;
            greet.innerHTML = "Awasome &#128515";
            console.log("you grab the combination");
        } else {
            img1.style.opacity = 0;
            img2.style.opacity = 0;
            console.log("combination not match");
        }
    }
}

// functionality to stay on first click waiting for second click
function clickMatch() {
    greet.innerHTML = "";
    if (counter) {
        this.style.opacity = 1;
        img1 = this;
        counter = false;
        return;
    }
    if (!counter) {
        this.style.opacity = 1;
        img2 = this;
        checkSuccess(img1, img2);
        counter = true;
        return;
    }
}

//click event for all
function setEvent() {
    for (image of images) {
        image.style.opacity = 0;
        image.parentElement.style.backgroundImage = "url('./image/pattern.avif')";
        image.onclick = clickMatch;
        image.addEventListener("click", blink);
    }
}

// Timer for the game
function timer() {
    let count = 100;
    id = setInterval(() => {
        --count;
        time.style.width = `${count}%`;
        win();
    }, 1000);
    id2 = setTimeout(() => {
        lose();
        clearInterval(id);
    }, 100000)
}
//on new record of minimum clicks
function newRecord(clicks) {
    clicks = clicks -1;
    if (minClick > clicks) {
        minClick = clicks;
        return 1;
    } 
}

// on lose the game
function lose() {
    click.innerHTML = 0;
    let sound = document.querySelector(".lose");
    heading.innerHTML = "Game Over,You Lose The Game &#128532;";
    sound.attributes[0].nodeValue = `./audio/gameOver.mp3`;
    reset();
    console.log("you lose");
    [...images].forEach(el=>el.style.opacity = 0);
    [...boxes].forEach(el=>el.style.backgroundImage = "url('./image/pattern.avif')");
}
// on winning of game
function win() {
    if ([...images].every(el => el.style.opacity == 1)) {
        let value = newRecord(clickCount);
        if(value) {
            heading.innerHTML = `New Record &#128562;you win in ${minClick} clicks`;
            let newRecord = document.querySelector(".newRecord");
            newRecord.attributes[0].nodeValue = `./audio/newRecord.mp3`;
        } else {
            heading.innerHTML = `Congratulations &#128516;,you win the game in ${clickCount - 1} Clicks`;
            let sound = document.querySelector(".win");
            sound.attributes[0].nodeValue = `./audio/win.mp3`;
        }
        reset();
    }
}
//reset the variables and stop timer
function reset() {
    numArray = [];
    srcArray = [];
    clickCount = 1;
    idx = 1;
    clearTimeout(id2);
    clearInterval(id);
}
