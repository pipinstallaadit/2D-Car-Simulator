let inc = 0.005;
let start = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(10, 10, 50) 
  drawTerrain()  
  start += inc * 0.5;
}

function drawTerrain() {  
  drawSky();  
  drawGround();
}

function drawSky() {
  fill(78, 159, 229); 
  noStroke();
  beginShape();
  vertex(0, 0); 
  generateTerrainVertices();
  vertex(width, 0); 
  endShape(CLOSE);
}

function drawGround() {
  fill(139, 69, 19); 
  noStroke();
  beginShape();
  vertex(0, height); 
  generateTerrainVertices();
  vertex(width, height); 
  endShape(CLOSE);
}

function generateTerrainVertices() {
  let xoff = start;
  for (let x = 0; x < width; x++) {
    let y = noise(xoff) * height / 2 + height / 2;
    vertex(x, y);
    xoff += inc;
  }
}

