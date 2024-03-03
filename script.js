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

Circle = {
  h: 0,
  k: 0,
  r: 5
}

function setup() {
  createCanvas(575, 575);
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
    },
    circle: {
      h: createInput("0", "number"),
      k: createInput("0", "number"),
      r: createInput("5", "number"),
    },
    solver: createSelect()
  }
  inputs.solver.option('Roots of a parabola');
  inputs.solver.option('Parabola intercepting with a line');
  inputs.solver.option('Circle intercepting with a line');
  inputs.solver.selected('Parabola intercepting with a line');
  inputs.solver.position(350, 515)
}

function draw() {
  background(225);
  translate(x + 575 / 2, y + 250);
  scale(zoom.value() / 100);
  // draw grid lines

  liner.m = inputs.liner.m.value();
  liner.b = inputs.liner.b.value();

  if (inputs.quadratic.a.value() != 0) {
    quadratic.a = inputs.quadratic.a.value();
  }
  quadratic.b = inputs.quadratic.b.value();
  quadratic.c = inputs.quadratic.c.value();

  Circle.h = inputs.circle.h.value();
  Circle.k = inputs.circle.k.value();
  Circle.r = inputs.circle.r.value();

  let increment;
  if (zoom.value() < 75) { increment = 2; } else { increment = 1; }
  stroke(50);
  for (let i = -5000; i < 5000; i += 25 * increment) {
    line(i, 5000, i, -5000);
    line(5000, i, -5000, i);
  }
  // grid arrows
  strokeWeight((100 / zoom.value() * 2.5));
  line(0, -5000, 0, 5000);
  line(-5000, 0, 5000, 0);

  strokeWeight((100 / zoom.value() * 5));

  // line
  if (inputs.solver.selected() != 'Roots of a parabola') {
    stroke(75, 200, 75);
    line(-5000, -(liner.m * -5000 + liner.b * 25), 5000, -(liner.m * 5000 + liner.b * 25));
  }

  // quadratic
  if (inputs.solver.selected() != 'Circle intercepting with a line') {
    noFill();
    stroke(0, 0, 255);
    beginShape();
    for (let x = (100 / zoom.value() * -5000); x < (100 / zoom.value() * 5000); x += 1.5) {

      vertex(x * 5, -(quadratic.a * x * x + quadratic.b * x + quadratic.c * 25));
    }
    endShape();
  }

  // circle
  if (inputs.solver.selected() == 'Circle intercepting with a line') {
    noFill();
    stroke(255, 0, 0);
    circle(-Circle.h * 25, -Circle.k * 25, Circle.r * 50);
  }

  // scale
  textStyle(NORMAL);
  strokeWeight(1);
  textSize(100 / zoom.value() * 12);
  textAlign(CENTER, CENTER);
  stroke(0);
  for (let i = -200; i < 201; i += increment) {
    text(i, i * 25 - 5, 5);
    if (i != 0) {
      text(i, -5, -((i - 1) * 25 + 15));
    }
  }

  // overlay UI
  scale(100 / zoom.value());
  strokeWeight(1);
  translate(-x - 575 / 2, -y - 250);
  fill(175);
  rect(0, 500, windowWidth, 75);
  fill(0);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT);

  //input fields
  if (inputs.solver.selected() != 'Roots of a parabola') {
    text("f(x) =              x  + ", 60, 540);
    inputs.liner.m.position(110, 537);
    inputs.liner.b.position(195, 537);
  } else {
    inputs.liner.m.position(0, -100);
    inputs.liner.b.position(0, -100);
  }

  if (inputs.solver.selected() == 'Circle intercepting with a line') {
    text("c(x) = ( x -              )² +  (y -              )² =             ²", 60, 563);
    inputs.circle.h.position(145, 560);
    inputs.circle.k.position(255, 560);
    inputs.circle.r.position(337, 560);
  } else {
    inputs.circle.h.position(0, -100);
    inputs.circle.k.position(0, -100);
    inputs.circle.r.position(0, -100);
  }

  if (inputs.solver.selected() == 'Parabola intercepting with a line') {
    text("g(x) =              x² +              x +", 57, 563);
    inputs.quadratic.a.position(110, 560);
    inputs.quadratic.b.position(195, 560);
    inputs.quadratic.c.position(275, 560);
  } else if (inputs.solver.selected() == 'Roots of a parabola') {
    text("g(x) =              x² +              x +", 57, 540);
    inputs.quadratic.a.position(110, 537);
    inputs.quadratic.b.position(195, 537);
    inputs.quadratic.c.position(275, 537);
  } else {
    inputs.quadratic.a.position(0, -100);
    inputs.quadratic.b.position(0, -100);
    inputs.quadratic.c.position(0, -100);
  }

  text("Zoom: " + zoom.value() + "%", 10, 517);
  text("type:", 300, 517);
}

function mouseDragged() {
  if (!(mouseX > 0 && mouseX < 575 && mouseY > 0 && mouseY < 500)) { draggable = false; }
  if (draggable) {
    x += movedX;
    y += movedY;
  }
}

function mouseReleased() {
  draggable = true;
}