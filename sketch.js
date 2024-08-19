//20201152 Minki Cho p5

p5.disableFriendlyErrors = true;
var seed = Math.random() * 10;
var xOff, yOff, dir, plus, wave_h, t;
var color1, color2;
let colors1 = "7fdeea-a3b7f0-a1e4f7-6d7db6"
  .split("-")
  .map((a) => "#" + a + "1a");
let colors12 = "7fdeea-a3b7f0-a1e4f7-6d7db6-0E0F37"
  .split("-")
  .map((a) => "#" + a + "00");
//let colorbg = "ffffff".split("-").map((a) => "#" + a);
let colorbg2 = "ffffff1a".split("-").map((a) => "#" + a);
var grad;
let filter;

var data; // a reference to all the data from the file
var dates = []; // an array of all the "date" values
var place = []; // an array of all the "text" values
var temps = []; // an array of all the "high" values
var status = [];

let loadedJSON = null;

var lost;


function preload() {
  //loads .json data
  loadedJSON = loadJSON("lost.json");
}

function setup() {
  // randomSeed(seed);
  createCanvas(1000, 5000);
  pixelDensity(1);
  console.log(colors1);
  color1 = colors1;
  //color2 = colors12;
  xOff = -500;
  yOff = 10;
  dir = 1;
  plus = 0.1;
  wave_h = 15;
  t = 0;
  filter = new makeFilter();
}

function draw() {
  randomSeed(seed);
  background("#F0EADA1a");
  noStroke();
  

  var JSONArray = loadedJSON["DATA"];
  for (var i = 0; i < JSONArray.length; i++) {
    dates[i] = JSONArray[i].reg_date;
    place[i] = JSONArray[i].take_place;
    temps[i] = map(JSONArray[i].id, 61740652, 61745931, 1, 100);
    status[i] = JSONArray[i].status;
    if (loadedJSON["DATA"][i]["status"] != "수령") {
      push();
      fill(map(temps[i], 1, 80, 0, 250));
      translate(0, random(yOff)*1.2);
      let lost_x = [];
          append(lost_x,random(0, width));
      let lost_y = [];
          append(lost_y, map(temps[i], 1, 100, height, 300));
      lost = ellipse(lost_x, lost_y, 12);
      pop();
      var d = dist(mouseX, mouseY, lost_x, lost_y);
              textSize(25);
        strokeWeight(5);
        fill(200,200,10);
      if (d < 8) {
        if (mouseIsPressed) {

          let place = loadedJSON["DATA"][i]["get_position"]
          let date = loadedJSON["DATA"][i]["reg_date"]
          text("Place: " + place + ", Date: " +date, mouseX, mouseY);
          for (let j=0; j<JSONArray.length; j++) {
            //if(place == loadedJSON["DATA"][j]["get_position"]){
              //push();
              lost.stroke(200, 200, 10);
              //pop();
            //}
          }
            //console.log(loadedJSON["DATA"][i]["take_place"]);
        }
        else {
          text("Lost: " + loadedJSON["DATA"][i]["get_name"], mouseX, mouseY);
        }
      }
    }
  }

  let mountain_h = height / int(10);
  for (let n = 0; n < height; n += random(mountain_h / 2, mountain_h)) {
    push();
    translate(0, height - n + 100);
    grad = drawingContext.createLinearGradient(0, -mountain_h, 0, mountain_h);
    grad.addColorStop(0, random(color1));
    //grad.addColorStop(1, random(color2));
    drawingContext.fillStyle = grad;
    beginShape();
    curveVertex(-n, n);
    for (let i = xOff; i < width - xOff; i += 100) {
      let p = random(-1, 1);
      curveVertex(i, cos(i + t) * p * random(yOff));
    }
    curveVertex(width + n, n);
    endShape(CLOSE);
    pop();
  }

  if (dir == 1) {
    if (yOff < wave_h) {
      dir = 1;
    } else if (yOff >= wave_h) {
      dir = -1;
      plus = random(0.1);
    }
  } else if (dir == -1) {
    if (yOff > 0) {
      dir = -1;
    } else if (yOff <= 0) {
      dir = 1;
      plus = random(0.1);
    }
  }

  yOff += plus * dir;
  t += 0.1;
  image(overAllTexture, 0, 0);
}

function makeFilter() {
  colorMode(HSB, 360, 100, 100, 100);
  drawingContext.shadowColor = color(0, 0, 5, 95);
  overAllTexture = createGraphics(width, height);
  overAllTexture.loadPixels();
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      overAllTexture.set(
        i,
        j,
        color(0, 0, 99, noise(i / 3, j / 3, (i * j) / 50) * random(5, 15))
      );
    }
  }
  overAllTexture.updatePixels();
}

function keyTyped() {
  saveCanvas("GENUARY 2022_0113_800*80", "png");
}
