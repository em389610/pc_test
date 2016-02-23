//V parse.com initialization of storage V

Parse.initialize("AfffIqRQX8tPjgqj7lO935JbzMsISdKgJQNNfFtw", "VsEBibf30t1iYMvCqlZjF9bQaDwKtRvR4skPZ9AJ");
//
//Canvas Variables
//
var previousFrameTime = 0;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var player_Name;


//
//Game Variables
//
var match = false;
var paused = false; //denotes whether the game is currently running

//
//Button Variables
//
var upPressed = false;
var downPressed = false;
var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
var leftkey = 37;
var rightkey = 39;
//
//Ball Variables
//
// var ballRadius=10;
// var ballX = canvas.width/2;
// var ballY = canvas.height-30;

//
//Gate Types
//- Each gate will have 8 possible combination.
//- Currently we only have AND & OR gates.
//- Gate image file name represents the formate of the gate:
//  GATETYPE then 3 digits 1,0, or x(blank):
//  -first = output
//  -second = left input
//  -third = right input
//  -AND00x means its an AND gate with the output=0, left input=0, and right input blank
//  -OR1x0 means its an OR gate with the output=1, left input is blank, and right input = 0
//  -AND11x means its an and gate with the output=1, left input=1, and right input blank
//  -etc.

var gateType = [];
    gateType[0]=document.getElementById("AND00x");
    gateType[1]=document.getElementById("AND0x0");
    gateType[2]=document.getElementById("AND0x1");
    gateType[3]=document.getElementById("AND01x");
    gateType[4]=document.getElementById("AND1x0");
    gateType[5]=document.getElementById("AND1x1");
    gateType[6]=document.getElementById("AND10x");
    gateType[7]=document.getElementById("AND11x");
    gateType[8]=document.getElementById("OR00x");
    gateType[9]=document.getElementById("OR0x0");
    gateType[10]=document.getElementById("OR0x1");
    gateType[11]=document.getElementById("OR01x");
    gateType[12]=document.getElementById("OR1x0");
    gateType[13]=document.getElementById("OR1x1");
    gateType[14]=document.getElementById("OR10x");
    gateType[15]=document.getElementById("OR11x");

//corresponding value to satisfy each gate.
var gateValue = [];
    gateValue[0]=2;
    gateValue[1]=2;
    gateValue[2]=0;
    gateValue[3]=0;
    gateValue[4]=3;
    gateValue[5]=1;
    gateValue[6]=3;
    gateValue[7]=1;
    gateValue[8]=0;
    gateValue[9]=0;
    gateValue[10]=3;
    gateValue[11]=3;
    gateValue[12]=1;
    gateValue[13]=2;
    gateValue[14]=1;
    gateValue[15]=2;
//
//Ball Object
// -radius
// -Coords - x and y
//
var ball = { radius:10, x: (canvas.width/2), y: (canvas.height-30)};

//
//Player Object
// -lives
// -score
// -value - 0 or 1
//
var player = { lives:['L','L','L','L','L','L','L','L','L','L'], score:0, value:1};


//
//Gate Objects
// -needed - players can enter 0 or 1
// -Coords - x and y
// -gate type - 0 or 1 for now
//
var gate1 = { need: 0, x:(canvas.width/4), y:-200, type:3, rate: Math.floor((Math.random() * 4) +1)};
var gate2 = { need: 1, x:(2*(canvas.width/4)), y:-200, type:14, rate: Math.floor((Math.random() * 4) +1)};
var gate3 = { need: 0, x:(3*(canvas.width/4)), y:-200, type:9, rate: Math.floor((Math.random() * 4) +1)};

while(gate2.rate == gate1.rate){
    gate2.rate = Math.floor((Math.random() * 4) +1);
}
while(gate3.rate == gate2.rate || gate3.rate == gate1.rate){
    gate3.rate = Math.floor((Math.random() * 4) +1);
}

var rate = {rate1 : gate1.rate, rate2 : gate2.rate, rate3 : gate3.rate};

var speedVis = new test();
speedVis.structure("speed")
    .location("#speedDiv")
    .data(rate)
    .visualize();

//
//Event Listeners
// -key pressed
// -key released
//
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


/*Key Handlers

 keyDownhandler()
 -If one of the specified keys is pressed down, dectected by the key code, the value for that key is set to true.
 keyUpHandler()
 -If one of the specified keys is released, dectected by the key code, the value for that key is set to false.

 Keys Detected(key code):
 -Right Arrow(39)
 -Left Arrow(37)
 -Up Arrow(38)
 -Down Arrow(40)
 -Space Bar (32)


 */


//Sound objects

var collection = new Audio("../Sounds/Collection.mp3");
var miss = new Audio("../Sounds/Miss.mp3");
var music = new Audio('../Sounds/Music.mp3');
var mute = false;
var bgm = document.getElementById("bgm");
var sfx = document.getElementById("sfx");


function keyDownHandler(e) {
    if(e.keyCode == rightkey) {
        rightPressed = true;
    }
    if(e.keyCode == leftkey) {
        leftPressed = true;
    }
    if(e.keyCode == 32){
        spacePressed = true;
    }
    if(e.keyCode == 77){
        if(mute == false){
            mute = true;
            music.pause();
            music.currentTime = 0;
        }
        else if(mute == true){
            mute = false;
            music.play();
        }
    }

}

function keyUpHandler(e) {
    if(e.keyCode == rightkey) {
        rightPressed = false;
    }
    if(e.keyCode == leftkey) {
        leftPressed = false;
    }
    if(e.keyCode == 32){
        spacePressed = false;
    }
}

//
//  drawBall()
//  Creates ball at the bottom of the screen that the player uses to match their value to the gates falling.
//
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();

}


//power up variables
//2x
var doublepts = { radius:20, x:(Math.random() * canvas.width), y:-100, alpha:1}; //variable for double points
var doubleptstimer = Math.floor(((Math.random()*60)+30)*1000); //random time interval to spawn between 30 to 90 sec
var ref_time2x = new Date();
var ref_time2x_ms = ref_time2x.getTime();
var spawn2x = false;
var collected2x = false;
var collected2x_time;
var collected2x_time_ms;
var collected2x_limit;
var doublepts_sound = new Audio('../Sounds/Doublepts.ogg');
function draw2x() {
    ctx.beginPath();
    ctx.arc(doublepts.x, doublepts.y, doublepts.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 0, 0," + doublepts.alpha + ")";
    ctx.fill();
    ctx.closePath();
}


//extra life
var extralife ={radius:20,x:(Math.random()* canvas.width), y:-100, alpha:1 };//variable for extra life
var extralifetimer = Math.floor((Math.random()+1)*60000);//random spawn between 1 to 2 min
var ref_timelife = new Date();
var ref_timelife_ms = ref_timelife.getTime();
var spawnlife = false;
var extralife_sound = new Audio("../Sounds/One_up.ogg");
function drawextralife(){
    ctx.beginPath();
    ctx.arc(extralife.x, extralife.y, extralife.radius, 0, Math.PI * 2);
    ctx.fillStyle ="rgba(0, 150, 0," + extralife.alpha +")";
    ctx.fill();
    ctx.closePath();
}

/*  drawGate()
 Creates a gate, given the x and y coordinates and an integer value represtening which gate type to draw.
 Gate Types:
 -AND
 8 different AND gate images.
 -OR
 8 differet OR gate images.

 //-NAND  to be added??
 //-XOR    to be added??
 */
function drawGate(x, y, gate){
    ctx.beginPath();
    ctx.drawImage(gateType[gate],x ,y ,60,120);
    ctx.closePath();
}

/*  changeGate()
 Function called to change the gates that are output. Each gate has a value that will satisfy the logic. The value is randomly slected between 0 or 1. For now the number that determines the gate, that is the value that satisfies that "gate".

 */
function changeGate(gate){

    //V Change value of the first gate V
    if(gate == 1){
        temp = Math.floor(Math.random() * 16);

        gate1.type = temp;
        gate1.need = gateValue[temp];
    }

    //V change the value of the second gate V
    if(gate == 2){
        temp = Math.floor(Math.random() * 16);

        gate2.type = temp;
        gate2.need = gateValue[temp];
    }

    //V change the value of the third gate V
    if(gate == 3){
        temp = Math.floor(Math.random() * 16);

        gate3.type = temp;
        gate3.need = gateValue[temp];
    }

}

/*  checkMatch()
 Function called to check whether the player's value matches the gate the player grabbed.
 If the needed value equals 2 then that means either a player vlaue of 0 or 1 would satisfy the gate.

 */
function checkMatch(gate){
    if(gate == "gate1"){
        if(gate1.need == player.value || gate1.need == 2){
            if(collected2x == true) player.score+= 200;
            else
            player.score += 100;

            collection.play();
        }
        else {
            player.lives.pop();
            miss.play();
        }
    }
    else if(gate == "gate2"){
        if(gate2.need == player.value || gate2.need == 2){
            if(collected2x == true) player.score+= 200;
            else
            player.score+= 100;

            collection.play();
        }else {
            player.lives.pop();
            miss.play();
        }
    }
    else if(gate =="gate3"){
        if(gate3.need == player.value || gate3.need == 2){
            if(collected2x == true) player.score+= 200;
            else
            player.score+= 100;

            collection.play()
        }else{
            player.lives.pop();
            miss.play();
        }
    }
    else{
        player.lives.pop();
    }

}

//resets all of the y gate coordinates and set a new random fall rate to each gate.
function resetGates(gate){

    if(gate == 1){
        changeGate(1);
        gate1.rate = Math.floor((Math.random() * 4) +1);
        while(gate1.rate == gate2.rate || gate1.rate == gate3.rate){
            gate1.rate = Math.floor((Math.random() * 4) +1);
        }
        gate1.y = -200;
    }
    else if(gate == 2){
        changeGate(2);
        gate2.rate = Math.floor((Math.random() * 4) +1);
        while(gate2.rate == gate1.rate || gate2.rate == gate3.rate){
            gate2.rate = Math.floor((Math.random() * 4) +1);
        }
        gate2.y = -200;
    }
    else if(gate == 3){
        changeGate(3);
        gate3.rate = Math.floor((Math.random() * 4) +1);
        while(gate3.rate == gate1.rate || gate3.rate == gate2.rate){
            gate3.rate = Math.floor((Math.random() * 4) +1);
        }
        gate3.y = -200;
    }

}

/*  checkCollision()
 This function is called everytime the screen is drawn. It checks whether the gates have either hit the bottom of the window or have hit the ball. This is done by checking the the x and y coordinates of the ball and the gates. If the gates hit the bottom of the window, they are reset and the player loses a life. If the gates come in contact with the ball, the player's vlaue and the gates needed value are checked. If they match, the score is increased by 100. If the values don't match, the player loses a life.

 */
function checkCollision(){

    if((gate1.y-10) >= canvas.height){
        resetGates(1);
    }
    if((gate2.y-10) >= canvas.height){
        resetGates(2);
    }
    if((gate3.y-10) >= canvas.height){
        resetGates(3);
    }
    if(ball.x >=gate1.x && ball.x <= (gate1.x+60) && (gate1.y+120) >= (ball.radius + ball.y)){
        checkMatch("gate1");
        resetGates(1);
    }
    if(ball.x >=gate2.x && ball.x <= (gate2.x+60) && (gate2.y+120) >= (ball.radius + ball.y)){
        checkMatch("gate2");
        resetGates(2);
    }
    if(ball.x >=gate3.x && ball.x <= (gate3.x+60) && (gate3.y+120) >= (ball.radius + ball.y)){
        checkMatch("gate3");
        resetGates(3);
    }

    if(doublepts.y - 20 >= canvas.height){
        doublepts.x = Math.random() * canvas.width;
        doublepts.y = -100;
        doubleptstimer = Math.floor((Math.random() +1)*60000);
        ref_time2x = new Date();
        ref_time2x_ms = ref_time2x.getTime();
        spawn2x = false;

    }

    if((ball.x >= doublepts.x-20) && (ball.x <= doublepts.x+20) && (ball.y <= doublepts.y+20) && (ball.y >=doublepts.y-20)){
        collected2x = true;
        collected2x_time = new Date();
        collected2x_time_ms = collected2x_time.getTime();
        collected2x_limit = collected2x_time_ms + 15000;
        doublepts_sound.play();
        spawn2x = false;
        doublepts.y = -100;
    }

    if(extralife.y - 20 >= canvas.height){
        extralife.x = Math.random() * canvas.width;
        extralife.y = -100;
        extralifetimer = Math.floor((Math.random() +2)*60000);
        spawnlife = false;
    }

    if((ball.x >= extralife.x-20) && (ball.x <= extralife.x+20) && (ball.y <= extralife.y+20) && (ball.y >=extralife.y-20)){
        extralife.y = -100;
        extralife_sound.play();
        player.lives.push('L');
        spawnlife = false;

    }

}

//setUpScreen()
//This function takes care of all the items that need to be put on the screen.
//
function setUpScreen(time){
    var FPS = Math.floor(1000 / (time - previousFrameTime));
    //var fpsSTRING = FPS.toString();
	document.getElementById("framesPerSecond").innerHTML = FPS + " FPS";
    previousFrameTime = time;
    ctx.font = "12px Verdana";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.fillText(fpsSTRING, 0, 10);
    //ctx.fillText("FPS", 20, 10);
    //ctx.fillText("Score:", 0, 30);
    //ctx.fillText(player.score, 40, 30);
	document.getElementById("score").innerHTML = "Score: " + player.score;
    //ctx.fillText("Lives:", 0, 50);
    //ctx.fillText(player.lives.length, 40, 50);
	document.getElementById("lives").innerHTML = "Lives: " + player.lives.length;
    //ctx.fillText("Current Value:", 0, 600);
    //ctx.fillText(player.value, 95, 600);
}

//changePlayerValue()
//This function is called when the mouse has been clicked. It will  change playerValue from a 1 to a 0 or a 0 to a 1.
//
function changePlayerValue(){
    if(player.value == 0){
        player.value = 1;
    }
    else{
        player.value = 0;
    }
}

//V on mouse move function V
//this function is called anytime the mouse moves on the screen and updates the ballx variable
//the coordinates are returned relative to the top left of the screen so we need to use the canvas bounds to adjust them.
//lastly, this function checks to make sure the position is inside the canvas. it will not change the coordinates if it is not

$(document).on("mousemove", function (event) {
    var rect = canvas.getBoundingClientRect();
    if((event.clientX - rect.left) - ball.radius > 0 && (event.clientX - rect.left) + ball.radius < canvas.width && (event.clientY - rect.top) > 0 && (event.clientY - rect.top) < canvas.height){
        ball.x = event.clientX - rect.left;
    }
});

/*
 This loops the music file by playing the music file again whenever it ends. Music file is choppy on the loop as better editing sofware is needed.
 */
music.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

bgm.addEventListener("change", function(){
    music.volume =bgm.value / 100;
});

sfx.addEventListener("change", function(){
    collection.volume = sfx.value/100;
    miss.volume = sfx.value/100;
});
music.play();

//   pause() -> this function changes the value of the variable playing (causing the game to pause)


function pause(){
    if (paused == false){
        paused = !paused;
    }
    else{
        paused = !paused;
        requestAnimationFrame(draw);
    }
}



/*  draw()
 This is the main function that draws the screen which includes the three gates, ball, score, lives, and FPS. The rate that the screen is drawn at varries.This is what frames per second(FPS) is in the top corner of the screen.

 IF the left or right arrows are pressed  the x coordinate of the ball is chnaged; right arrow= +4, left arrow -4.
 The Y coordinate of the gates is increased, creating the animation of the gates falling.
 If the space bar is pressed the player's value  will change from 0 to 1 or vice versa. (kinda glitchy)

 */


function draw(time) {


    setUpScreen(time);

    checkCollision();

    drawGate(gate1.x, gate1.y, gate1.type);
    drawGate(gate2.x, gate2.y, gate2.type);
    drawGate(gate3.x, gate3.y, gate3.type);

    drawBall();
    ctx.fillStyle = "#FF0000";
    ctx.fillText(player.value, ball.x - 4, ball.y + 3);

    var current_time = new Date();
    var current_time_ms = current_time.getTime();
    if (ref_time2x_ms + doubleptstimer - current_time_ms <= 1000 && ref_time2x_ms + doubleptstimer - current_time_ms >=0) {
        spawn2x = true;
    }

    if (ref_timelife_ms + extralifetimer - current_time_ms <= 1000 && ref_timelife_ms + extralifetimer - current_time_ms >=0) {
        spawnlife = true;
    }


    if (spawn2x == true) {
        draw2x();
        doublepts.alpha = doublepts.alpha - .005;
        if (doublepts.alpha <= 0) doublepts.alpha = 1;

        doublepts.y = doublepts.y + 2;

        ctx.fillStyle ="#FFFF00";
        ctx.font = "20px Verdana";
        ctx.fillText("2x", doublepts.x - 8, doublepts.y + 6);
        ctx.fillStyle ="#FF0000";
        ctx.font = "12px Verdana"
    }



    if (spawnlife == true) {
        drawextralife();
        extralife.alpha = extralife.alpha - .01;
        if (extralife.alpha <= 0) extralife.alpha = 1;

        extralife.y = extralife.y + 2;

        ctx.fillStyle ="#1D7CF2";
        ctx.font = "16px Verdana";
        ctx.fillText("1UP", extralife.x - 12, extralife.y + 6);
        ctx.fillStyle ="#FF0000";
        ctx.font = "12px Verdana"
    }


    if(collected2x == true) {
        ctx.fillText("2x: " + Math.floor((collected2x_limit - current_time_ms) / 1000) +" Sec", 0, canvas.height / 2);

        if(current_time_ms  >= collected2x_limit){
            doublepts.x = Math.random() * canvas.width;
            doublepts.y = -100;
            doubleptstimer = Math.floor((Math.random() +1)*60000);
            ref_time2x = new Date();
            ref_time2x_ms = ref_time2x.getTime();
            collected2x = false;

        }
    }

    gate1.y = gate1.y + gate1.rate;
    gate2.y = gate2.y + gate2.rate;
    gate3.y = gate3.y + gate3.rate;


    var speed = {rate1: gate1.rate, rate2:gate2.rate, rate3: gate3.rate};
    speedVis.update(speed);

    if (rightPressed && ball.x + ball.radius < canvas.width) {
        ball.x += 4;
    }
    if (leftPressed && ball.x - ball.radius > 0) {
        ball.x -= 4;
    }

    canvas.onclick = changePlayerValue;


    if (player.lives == 0) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		document.getElementById("gameOverScore").innerHTML = "You scored " + player.score + " points!";
		checkHighScore();
		pause();
        ctx.textAlign="start";
    }




    if (!paused){
        requestAnimationFrame(draw);
    }
}
/*
******High Score Functions*********
*/
function checkHighScore(){
var Score = Parse.Object.extend("Score");
var query = new Parse.Query(Score);
query.lessThan("score", player.score);
query.count({
  success: function(count) {
	if(count > 0){
		loadNewHighScoreScreen();
	}
	else{
		loadEndMenu();
	}
  },
  error: function(error) {
    alert("Error retrieving high scores");
	loadEndMenu();
  }
});	
	
}


function addNewHighScore(){
	player_Name = document.getElementById("nameInput").value;
	deleteLowScore();
	pushNewHighScore();
	refreshHighScores();
	loadEndMenu();
}

function deleteLowScore(){
	var Score = Parse.Object.extend("Score");
    var query = new Parse.Query(Score);
	query.ascending("score");
	query.first({
		success: function(object) {
			object.destroy({
				success: function(myObject) {
					console.log('Object deleted from cloud');
				},
				error: function(myObject, error) {
					alert("object not deleted from cloud");
				}
			});	
		},
		error: function(error) {
			alert("Error retrieving high scores");
		}
	});
}

function pushNewHighScore(){
	var Score = Parse.Object.extend("Score");
	var score = new Score();

	score.set("score", player.score);
	score.set("playerName", player_Name);

	score.save(null, {
		success: function(score) {


				console.log('new high score saved succesfully');
			},
			error: function(score, error) {



				
				alert('Failed to save high score');
				}
				});
}


function refreshHighScores(){
var Score = Parse.Object.extend("Score");
var query = new Parse.Query(Score);
query.descending("score");
query.find({
  success: function(results) {


    for (var i = 0; i < results.length && i < 10; i++) {
      var object = results[i];
	  if(i==9){
		 document.getElementById("highScore" + (i+1)).innerHTML = (i+1) + ". " + object.get('playerName') + " - " + object.get('score') + "pts"; 
	  }
	  else{
		 document.getElementById("highScore" + (i+1)).innerHTML = (i+1) + ".   " + object.get('playerName') + " - " + object.get('score') + "pts"; 
	  }
      
    }
	
	for (var i = 0; i < results.length && i < 10; i++) {
      var object = results[i];
	  if(i==9){
		 document.getElementById("highScoreEnd" + (i+1)).innerHTML = (i+1) + ". " + object.get('playerName') + " - " + object.get('score') + "pts"; 
	  }
	  else{
		 document.getElementById("highScoreEnd" + (i+1)).innerHTML = (i+1) + ".   " + object.get('playerName') + " - " + object.get('score') + "pts"; 
	  }
      
    }
	
  },
  error: function(error) {

    alert("Error retrieving high scores");
  }
});			


}



function loadConfiguration() {
    //clear all user interface elements
    var temp = document.getElementsByClassName("ui");
    for (i = 0; i < temp.length; ++i) {
        temp[i].style.display = "none";
    }
    //receive new keystrokes
    ctx.font = "20px Verdana";
    ctx.textAlign="center";
    ctx.fillText("Input left movement key", canvas.width / 2, canvas.height / 2);
    document.addEventListener("keydown", assignleft, false);

}

function assignleft(key){
    leftkey = key.keyCode;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("Input right movement key", canvas.width/2, canvas.height/2);
    document.addEventListener("keydown", assignright,false);
    document.removeEventListener("keydown",assignleft,false);
    ctx.textAlign="start";
}

function assignright(key){
    rightkey = key.keyCode;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadoptions();
    document.removeEventListener("keydown", assignright, false);
}


function loadControls(){
    //clear all user interface elements
	$(".ui").fadeOut(600);
    var temp = document.getElementsByClassName("ui");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "none";
    }
    //load all relevant user interface elements
    temp = document.getElementsByClassName("controls");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "inline";
    }
	$(".controls").hide();
	$(".controls").fadeIn(600);
}

function loadHowToPlay(){
    //clear all user interface elements
	$(".ui").fadeOut(600);
    var temp = document.getElementsByClassName("ui");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "none";
    }
    //load all relevant user interface elements
    temp = document.getElementsByClassName("howToPlay");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "inline";
    }
	$(".howToPlay").hide();
	$(".howToPlay").fadeIn(600);
}

function loadoptions(){
    //clear all user interface elements
	$(".ui").fadeOut(600);
    var temp = document.getElementsByClassName("ui");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "none";
    }
    //load all relevant user interface elements
    temp = document.getElementsByClassName("options");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "inline";
    }
	$(".options").hide();
	$(".options").fadeIn(600);
}

function loadMainMenu(){
	refreshHighScores();
	$(".ui").fadeOut(600);
    //clear all user interface elements
    var temp = document.getElementsByClassName("ui");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "none";
    }
    //load all relevant user interface elements
    temp = document.getElementsByClassName("mainMenu");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "inline";
    }
	$(".mainMenu").hide();
	$(".mainMenu").fadeIn(600);
}

function loadMainMenuFirstTime(){
	refreshHighScores();
    //clear all user interface elements
    var temp = document.getElementsByClassName("ui");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "none";
    }
    //load all relevant user interface elements
    temp = document.getElementsByClassName("mainMenu");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "inline";
    }
	$("#play").hide();
	$("#howTo").hide();
	$("#controls_MainMenu").hide();
	$("#option").hide();
	$("#highScores_MainMenu").hide();
	
	$("#play").fadeIn(600);
	$("#howTo").fadeIn(600);
	$("#controls_MainMenu").fadeIn(600);
	$("#option").fadeIn(600);
	$("#highScores_MainMenu").fadeIn(600);
}

//main menu animation

blinkTime = 0; //sets animation loop so cursor blinks for a few times before writing gate grabber

function firstFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame2").show();
	if(blinkTime < 1){
		setTimeout(secondFrame, 530)
		++blinkTime;
	}
	else{
		setTimeout(thirdFrame, 400)
	}
	
}

function secondFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame1").show();
	setTimeout(firstFrame, 530)
}

function thirdFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame3").show();
	setTimeout(fourthFrame, 200)	
}

function fourthFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame4").show();
	setTimeout(fifthFrame, 500)	
}
function fifthFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame5").show();
	setTimeout(sixthFrame, 200)	
}
function sixthFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame6").show();
	setTimeout(seventhFrame, 510)	
}
function seventhFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame7").show();
	setTimeout(eighthFrame, 530)	
}
function eighthFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame8").show();
	setTimeout(ninthFrame, 500)	
}
function ninthFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame9").show();
	setTimeout(tenthFrame, 150)	
}
function tenthFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame10").show();
	setTimeout(eleventhFrame, 200)	
}
function eleventhFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame11").show();
	setTimeout(twelthFrame, 300)	
}
function twelthFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame12").show();
	setTimeout(thirteenthFrame, 100)	
}
function thirteenthFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame13").show();
	setTimeout(fourteenthFrame, 250)	
}
function fourteenthFrame(){
	$(".mainMenuAnimation").hide();
	$("#frame14").show();
	setTimeout(fifteenthFrame, 200)	
}
function fifteenthFrame(){
	$(".mainMenuAnimation").hide();
	$("#menuLogo").show();
	setTimeout(loadMainMenuFirstTime, 500)	
}

function gamestartanimation(){
	//clear all user interface elements
    var temp = document.getElementsByClassName("ui");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "none";
    }
	//load all relevant user interface elements
    temp = document.getElementsByClassName("mainMenuAnimation");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "inline";
    }
	
	$(".mainMenuAnimation").hide();
	$("#frame1").fadeIn(600, firstFrame());
	
	
}

function loadNewHighScoreScreen(){
    //clear all user interface elements
	$(".ui").fadeOut(600);
    var temp = document.getElementsByClassName("ui");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "none";
    }
    //load all relevant user interface elements
    temp = document.getElementsByClassName("newHighScoreScreen");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "inline";
    }
	$(".newHighScoreScreen").hide();
	$(".newHighScoreScreen").fadeIn(600);
	
}

function loadHighScores(){
	refreshHighScores();
	$(".ui").fadeOut(600);
    //clear all user interface elements
    var temp = document.getElementsByClassName("ui");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "none";
    }
    //load all relevant user interface elements
    temp = document.getElementsByClassName("highScores");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "inline";
    }
	$(".highScores").hide();
	$(".highScores").fadeIn(600);
	
}

function loadEndMenu(){
	refreshHighScores();
    //clear all user interface elements
    var temp = document.getElementsByClassName("ui");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "none";
    }
    //load all relevant user interface elements
    temp = document.getElementsByClassName("endGame");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "inline";
    }
	setTimeout(refreshHighScores, 2500);
}

function newGame(){
    //clear all user interface elements
	$(".ui").fadeOut(600);
    var temp = document.getElementsByClassName("ui");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "none";
    }
    //load all relevant user interface elements
    temp = document.getElementsByClassName("inGame");
    for(i=0; i<temp.length; ++i){
        temp[i].style.display = "inline";
    }
	$(".inGame").hide();
	$(".inGame").fadeIn(600);
    //reset game variables
    player = { lives:['L','L','L','L','L','L','L','L','L','L'], score:0, value:1};
    		gate1 = { need: 0, x:(canvas.width/4), y:-200, type:3, rate: Math.floor((Math.random() * 4) +1)};
    		gate2 = { need: 1, x:(2*(canvas.width/4)), y:-200, type:14, rate: Math.floor((Math.random() * 4) +1)};
    		gate3 = { need: 0, x:(3*(canvas.width/4)), y:-200, type:9, rate: Math.floor((Math.random() * 4) +1)};

        		while(gate2.rate == gate1.rate){
        			gate2.rate = Math.floor((Math.random() * 4) +1);
        		}
    		while(gate3.rate == gate2.rate || gate3.rate == gate1.rate){
        			gate3.rate = Math.floor((Math.random() * 4) +1);
        		}
    extralife ={radius:20,x:(Math.random()* canvas.width), y:-100, alpha:1 };//variable for extra life
    extralife.x = Math.random()*canvas.width;
    extralife.y = -100;
    ref_timelife = new Date();
    ref_timelife_ms = ref_timelife.getTime();
    spawnlife = false;

    doublepts.x = Math.random()*canvas.width;
    doublepts.y = -100;
    doubleptstimer = Math.floor((Math.random()+1)*60000); //random time interval to spawn between 1 minute to 2 minute
    ref_time2x = new Date();
    ref_time2x_ms = ref_time2x.getTime();
    spawn2x = false;
    collected2x = false;
    //start the game
    		paused = false;
    requestAnimationFrame(draw);
}

	function quitGame(){
    		paused = true;
    		requestAnimationFrame(clearscreen);
    		loadMainMenu();
    	}

		function clearscreen(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		
// V Main Event Loop V   <- this is what runs "sequentially" after everything has been loaded; good starting point for trying to figure out whats going on
//loadMainMenu();
//wait for html to load before animating
gamestartanimation();

