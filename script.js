let x = 0;
let y = 0;
let zoom;
let inputs;
let draggable = true;
let fixedWindowWidth;
let fixedWindowHeight;

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
  createCanvas(windowWidth, windowHeight * 0.99);
  fixedWindowWidth = windowWidth;
  fixedWindowHeight = windowHeight;
  if (fixedWindowWidth < 600 || fixedWindowWidth * 0.99 < 600) {
    alert("Your screen is too small.\nPress Ctrl + - to make it bigger then reload this page otherwise this program will not be able to work properly.\n please keep in mind that this may decalibrated the movement system.");
  }
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
  inputs.solver.option('Parabola intercepting with a line (BETA))');
  inputs.solver.option('Roots of a parabola (BETA)');
  inputs.solver.option('Circle intercepting with a line');
  inputs.solver.position(345, 508)
}

function draw() {
  background(225);
  translate(x + fixedWindowWidth / 2, y + 250);
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
  if (inputs.circle.r.value() > 0) {
    Circle.r = inputs.circle.r.value();
  }

  let increment;
  if (zoom.value() < 75) { increment = 2; } else { increment = 1; }
  stroke(50);
  for (let i = -2000; i < 2000; i += 25 * increment) {
    line(i, 2000, i, -2000);
    line(2000, i, -2000, i);
  }
  // grid arrows
  strokeWeight((100 / zoom.value() * 2.5));
  line(0, -2000, 0, 2000);
  line(-2000, 0, 2000, 0);

  strokeWeight((100 / zoom.value() * 5));

  // line
  if (inputs.solver.selected() != 'Roots of a parabola (BETA)') {
    stroke(75, 200, 75);
    line(-2000, -(liner.m * -2000 + liner.b * 25), 2000, -(liner.m * 2000 + liner.b * 25));
  }

  // quadratic
  if (inputs.solver.selected() != 'Circle intercepting with a line') {
    noFill();
    stroke(0, 0, 255);
    beginShape();
    for (let x = -2000; x < 2000; x += 0.5) {

      vertex(x * 5, -(quadratic.a * x * x + quadratic.b * x + quadratic.c * 25));
    }
    endShape();
  }

  // circle
  if (inputs.solver.selected() == 'Circle intercepting with a line') {
    noFill();
    stroke(255, 0, 0);
    circle(-Circle.h * 25, Circle.k * 25, Circle.r * 50);
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

  // intersepts
  var points;
  if (inputs.solver.selected() == 'Parabola intercepting with a line (BETA))') {
    points = parabolaInterceptWithLine(quadratic, liner);
    fill(232, 165, 9);
    noStroke();
  }
  if (inputs.solver.selected() == 'Roots of a parabola (BETA)') {
    points = parabolaInterceptWithLine(quadratic, { m: 0, b: 0 });
    fill(232, 165, 9);
    noStroke();
  }
  if (inputs.solver.selected() == 'Circle intercepting with a line') {
    Circle = { h: int(Circle.h), k: int(Circle.k), r: int(Circle.r) };
    liner = { m: int(liner.m), b: int(liner.b) };
    quad = {
      a: 1 + pow(liner.m, 2),
      b: 2 * Circle.h + 2 * (liner.m * (Circle.k + liner.b)) + liner.m,
      c: pow(Circle.h, 2) + pow(Circle.k + liner.b, 2) - pow(Circle.r, 2) + liner.b
    };
    points = parabolaInterceptWithLine(quad, liner);
    fill(232, 165, 9);
    noStroke();
  }
  for (i = 0; i < points.length; i++) {
    ellipse(points[i].x * 25, -points[i].y * 25, 7, 7);
  }

  // overlay UI
  scale(100 / zoom.value());
  strokeWeight(1);
  translate(-x - fixedWindowWidth / 2, -y - 250);
  fill(175);
  rect(0, 500, fixedWindowWidth, fixedWindowHeight);
  fill(0);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT);

  //input fields
  if (inputs.solver.selected() != 'Roots of a parabola (BETA)') {
    text("f(x) =              x  + ", 60, 540);
    inputs.liner.m.position(108, 530);
    inputs.liner.b.position(185, 530);
  } else {
    inputs.liner.m.position(0, -100);
    inputs.liner.b.position(0, -100);
  }

  if (inputs.solver.selected() == 'Circle intercepting with a line') {
    text("c(x) = ( x +             )² +  (y +             )² =            ²", 60, 563);
    inputs.circle.h.position(140, 555);
    inputs.circle.k.position(252, 555);
    inputs.circle.r.position(328, 555);
  } else {
    inputs.circle.h.position(0, -100);
    inputs.circle.k.position(0, -100);
    inputs.circle.r.position(0, -100);
  }

  if (inputs.solver.selected() == 'Parabola intercepting with a line (BETA))') {
    text("g(x) =              x² +            x +", 57, 563);
    inputs.quadratic.a.position(108, 553);
    inputs.quadratic.b.position(185, 553);
    inputs.quadratic.c.position(255, 553);
  } else if (inputs.solver.selected() == 'Roots of a parabola (BETA)') {
    text("g(x) =              x² +            x +", 57, 540);
    inputs.quadratic.a.position(108, 530);
    inputs.quadratic.b.position(185, 530);
    inputs.quadratic.c.position(255, 530);
  } else {
    inputs.quadratic.a.position(0, -100);
    inputs.quadratic.b.position(0, -100);
    inputs.quadratic.c.position(0, -100);
  }

  text("Zoom: " + zoom.value() + "%", 10, 517);
  text("Type:", 300, 517);
  textAlign(CENTER);
  text(pointsToString(points), fixedWindowWidth / 2, 585);
}

function mouseDragged() {
  if (!(mouseY < 500)) { draggable = false; }
  if (draggable) {
    x += movedX;
    y += movedY;
  }
}

function mouseReleased() {
  draggable = true;
}

function pointsToString(points) {
  let keyword = "intercept";
  if (inputs.solver.selected() == 'Roots of a parabola (BETA)') {
    keyword = "root";
  }
  if (points.length == 0) {
    return "There are no " + keyword + "s";
  }
  if (points.length == 1) {
    return "There is one " + keyword + " at (" + points[0].x + ", " + points[0].y + ")";
  }
  if (points.length == 2) {
    return "There are two " + keyword + "s at (" + points[0].x + ", " + points[0].y + ") and (" + points[1].x + ", " + points[1].y + ")";
  }
}

function parabolaInterceptWithLine(Parabola, Line) {
  Line = { m: int(Line.m), b: int(Line.b) };
  let a = Parabola.a;
  let b = Parabola.b - Line.m;
  let c = Parabola.c - Line.b;
  let discriminant = pow(b, 2) - (4 * a * c);
  discriminant = Math.floor(discriminant * 1000) / 1000;
  if (discriminant < 0) { return []; }

  // POI #1
  let x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  x1 = Math.floor(x1 * 1000) / 1000;
  let y1 = Line.m * x1 + Line.b;
  y1 = Math.floor(y1 * 1000) / 1000;
  if (discriminant == 0) {
    return [{ x: x1, y: y1 }];
  }
  if (discriminant > 0) {
    // POI #2
    let x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    x2 = Math.floor(x2 * 1000) / 1000;
    let y2 = Line.m * x2 + Line.b;
    y2 = Math.floor(y2 * 1000) / 1000;
    return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  }
}
