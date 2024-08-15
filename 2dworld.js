const planck = window.planck;
const Vec2 = planck.Vec2;

let SCALE = 30;
let world, carBody, wheel1, wheel2;
let inc = 0.005;
let start = 0;
let terrainVertices = [];
let maxVelocity = 3; // Max velocity in meters per second (planck.js units)

function setup() {
  createCanvas(400, 400);

  world = planck.World(Vec2(0, -10));

  generateTerrain();
  createGround();

  createCar();
}

function draw() {
  background(202, 244, 255);

  // Get the car's current velocity
  let currentVelocity = carBody.getLinearVelocity().x;

  // Apply a forward force only if the car's current velocity is below the max velocity
  if (currentVelocity < maxVelocity) {
    carBody.applyForceToCenter(Vec2(10, 0));
  }

  // Step the physics world
  world.step(1 / 60);

  let carScreenX = carBody.getPosition().x * SCALE;
  let translateX = width / 4 - carScreenX;

  push();
  translate(translateX, 0);

  drawTerrain();

  drawBody(carBody, 'blue');
  drawBody(wheel1, 'black');
  drawBody(wheel2, 'black');

  pop();

  if (terrainVertices[terrainVertices.length - 1].x * SCALE < carScreenX + width) {
    generateMoreTerrain();
    createGround();
  }
}

function generateMoreTerrain() {
  let lastVertex = terrainVertices[terrainVertices.length - 1];
  let xoff = start + lastVertex.x * inc * SCALE;

  for (let x = lastVertex.x * SCALE + 1; x < lastVertex.x * SCALE + width; x++) {
    let y = noise(xoff) * height * 0.5 + height * 0.25;
    let newVertex = { x: x / SCALE, y: (height - y) / SCALE };
    terrainVertices.push(newVertex);
    xoff += inc;
  }

  start += inc;
}

function generateTerrain() {
  let xoff = start;
  for (let x = 0; x < width; x++) {
    let y = noise(xoff) * height * 0.5 + height * 0.25;
    terrainVertices.push({ x: x / SCALE, y: (height - y) / SCALE });
    xoff += inc;
  }
  start += inc;
}

function createGround() {
  let ground = world.createBody();

  for (let i = 0; i < terrainVertices.length - 1; i++) {
    let v1 = Vec2(terrainVertices[i].x, terrainVertices[i].y);
    let v2 = Vec2(terrainVertices[i + 1].x, terrainVertices[i + 1].y);
    ground.createFixture(planck.Edge(v1, v2), {
      friction: 0.6,
    });
  }
}

let carStartX = 100 / SCALE;

function createCar() {
  let carY = getYPositionAtX(carStartX) + 20 / SCALE;

  carBody = world.createBody({
    type: 'dynamic',
    position: Vec2(carStartX, carY),
    angularDamping: 5.0,
  });

  carBody.createFixture(planck.Box(30 / SCALE, 10 / SCALE), {
    density: 1.0,
    friction: 0.3,
  });

  wheel1 = createWheel(Vec2(carStartX - 20 / SCALE, carY - 10 / SCALE));
  wheel2 = createWheel(Vec2(carStartX + 20 / SCALE, carY - 10 / SCALE));

  world.createJoint(
    planck.RevoluteJoint({}, carBody, wheel1, Vec2(carStartX - 20 / SCALE, carY - 10 / SCALE))
  );
  world.createJoint(
    planck.RevoluteJoint({}, carBody, wheel2, Vec2(carStartX + 20 / SCALE, carY - 10 / SCALE))
  );

  carBody.applyForceToCenter(Vec2(10, 0));
}

function createWheel(position) {
  let wheel = world.createBody({
    type: 'dynamic',
    position: position,
  });

  wheel.createFixture(planck.Circle(10 / SCALE), {
    density: 1.0,
    friction: 0.9,
    restitution: 0.1,
  });

  return wheel;
}

function getYPositionAtX(x) {
  for (let i = 0; i < terrainVertices.length - 1; i++) {
    if (terrainVertices[i].x <= x && terrainVertices[i + 1].x >= x) {
      let x1 = terrainVertices[i].x;
      let y1 = terrainVertices[i].y;
      let x2 = terrainVertices[i + 1].x;
      let y2 = terrainVertices[i + 1].y;
      return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
    }
  }
  return terrainVertices[terrainVertices.length - 1].y;
}

function drawTerrain() {
  fill(140, 59, 12); // Brown color for terrain
  noStroke();
  beginShape();
  vertex(terrainVertices[0].x * SCALE, height); // Ensure starting vertex connects to bottom
  for (let i = 0; i < terrainVertices.length; i++) {
    vertex(terrainVertices[i].x * SCALE, height - terrainVertices[i].y * SCALE);
  }
  vertex(terrainVertices[terrainVertices.length - 1].x * SCALE, height); // Ensure ending vertex connects to bottom
  endShape(CLOSE);
}

function drawBody(body, color) {
  push();
  translate(body.getPosition().x * SCALE, height - body.getPosition().y * SCALE);
  rotate(-body.getAngle());
  fill(color);

  for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
    const shape = fixture.getShape();
    switch (shape.getType()) {
      case 'circle':
        drawCircle(shape);
        break;
      case 'polygon':
        drawPolygon(shape);
        break;
    }
  }

  pop();
}

function drawCircle(shape) {
  let radius = shape.getRadius() * SCALE;
  ellipse(0, 0, radius * 2, radius * 2);
}

function drawPolygon(shape) {
  beginShape();
  const vertices = shape.m_vertices;
  vertex(vertices[0].x * SCALE, -vertices[0].y * SCALE);
  for (let i = 1; i < vertices.length; i++) {
    vertex(vertices[i].x * SCALE, -vertices[i].y * SCALE);
  }
  endShape(CLOSE);
}
