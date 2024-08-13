let world;
let carBody;
let leftWheel, rightWheel;
let wheelJoint1, wheelJoint2;

function setup() {
  createCanvas(800, 400);
  world = planck.World(planck.Vec2(0, -10));
  let ground = world.createBody();
  ground.createFixture(planck.Edge(planck.Vec2(-40, 0), planck.Vec2(40, 0)), 0);

  carBody = world.createBody({
    type: 'dynamic',
    position: planck.Vec2(0, 4)
  });
  carBody.createFixture(planck.Box(2, 0.5), { 
    density: 1.0,
    friction: 0.3,
    restitution: 0.1
  });

  leftWheel = world.createBody({
    type: 'dynamic',
    position: planck.Vec2(-1.5, 3.5)
  });
  leftWheel.createFixture(planck.Circle(0.5), {
    density: 1.0,
    friction: 0.9,
    restitution: 0.1
  });

  rightWheel = world.createBody({
    type: 'dynamic',
    position: planck.Vec2(1.5, 3.5)
  });
  rightWheel.createFixture(planck.Circle(0.5), {
    density: 1.0,
    friction: 0.9,
    restitution: 0.1
  });

  wheelJoint1 = world.createJoint(planck.WheelJoint({
    motorSpeed: 0,
    maxMotorTorque: 20,
    enableMotor: true,
    frequencyHz: 4.0,
    dampingRatio: 0.7
  }, carBody, leftWheel, leftWheel.getPosition(), planck.Vec2(0, 1)));

  wheelJoint2 = world.createJoint(planck.WheelJoint({
    motorSpeed: 0,
    maxMotorTorque: 20,
    enableMotor: true,
    frequencyHz: 4.0,
    dampingRatio: 0.7
  }, carBody, rightWheel, rightWheel.getPosition(), planck.Vec2(0, 1)));
}

function draw() {
  background(220);

  world.step(1 / 60);

  stroke(0);
  strokeWeight(4);
  line(0, height - 50, width, height - 50);

  drawBox(carBody, 4, 1);

  drawCircle(leftWheel, 1);
  drawCircle(rightWheel, 1);

  if (keyIsDown(RIGHT_ARROW)) {
    wheelJoint1.setMotorSpeed(-10);
    wheelJoint2.setMotorSpeed(-10);
  } else if (keyIsDown(LEFT_ARROW)) {
    wheelJoint1.setMotorSpeed(10);
    wheelJoint2.setMotorSpeed(10);
  } else {
    wheelJoint1.setMotorSpeed(0);
    wheelJoint2.setMotorSpeed(0);
  }
}

function drawBox(body, w, h) {
  const pos = body.getPosition();
  const angle = body.getAngle();
  push();
  translate(pos.x * 100, height - pos.y * 100 - 50); 
  rotate(-angle);
  rectMode(CENTER);
  fill(150);
  rect(0, 0, w * 100, h * 100);
  pop();
}

function drawCircle(body, r) {
  const pos = body.getPosition();
  push();
  translate(pos.x * 100, height - pos.y * 100 - 50); 
  fill(50);
  ellipse(0, 0, r * 100, r * 100);
  pop();
}
