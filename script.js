let x = 0;
let y = 0;
let zoom;
let inputs;
let draggable = true;

liner = {
  m: 1,
  b: 0,
}

quadratic = {
  a: 1,
  b: 0,
  c: 0
}

function setup() {
  createCanvas(500, 575);
  zoom = createSlider(50, 200, 100);
  zoom.position(120, 510);
  zoom.size(150);

  inputs = {
    liner: {
      m: createInput("1", "number"),
      b: createInput("0", "number"),
    },
    quadratic: {
      a: createInput("1", "number"),
      b: createInput("0", "number"),
      c: createInput("0", "number")
    }
  }
  inputs.liner.m.position(85, 535);
}

function draw() {
  background(225);
  translate(x + 250, y + 250);
  scale(zoom.value() / 100);
  // draw grid lines
  let increment;
  if (zoom.value() < 75) { increment = 2; } else { increment = 1; }
  stroke(50);
  for (let i = -1000; i < 1000; i += 25 * increment) {
    line(i, 1000, i, -1000);
    line(1000, i, -1000, i);
  }
  // grid arrows
  strokeWeight((100 / zoom.value() * 2.5));
  line(0, -1000, 0, 1000);
  line(-1000, 0, 1000, 0);

  // line
  strokeWeight((100 / zoom.value() * 5));
  stroke(75, 200, 75);
  line(-1000, -(liner.m * -1000 + liner.b * 25), 1000, -(liner.m * 1000 + liner.b * 25));

  // quadratic
  noFill();
  stroke(0, 0, 255);
  beginShape();
  for (let x = (100 / zoom.value() * -1000); x < (100 / zoom.value() * 1000); x += 1.5) {

    vertex(x * 5, -(quadratic.a * x * x + quadratic.b * x + quadratic.c * 25));
  }
  endShape();

  // scale
  textStyle(NORMAL);
  strokeWeight(1);
  textSize(100 / zoom.value() * 12);
  textAlign(CENTER, CENTER);
  stroke(0);
  for (let i = -40; i < 41; i += increment) {
    text(i, i * 25 - (100 / zoom.value() * 5), 0);
    if (i != 0) {
      text(i, 0, i * 25 + (100 / zoom.value() * 15));
    }
  }

  // overlay UI
  scale(100 / zoom.value());
  strokeWeight(1);
  translate(-x - 250, -y - 250);
  fill(175);
  rect(0, 500, 500, 75);
  fill(0);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT);
  text("Zoom: " + zoom.value() + "%", 10, 517);
  text("f(x) = x + ", 10, 540);
}

function mouseDragged() {
  if (!(mouseX > 0 && mouseX < 500 && mouseY > 0 && mouseY < 500)) { draggable = false; }
  if (draggable) {
    x += movedX;
    y += movedY;
  }
}

function mouseReleased() {
  draggable = true;
}