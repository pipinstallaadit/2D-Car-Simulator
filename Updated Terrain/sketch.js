let inc = 0.005; // Base increment for Perlin noise
let start = 0; // Starting offset for Perlin noise
let roughness = 0.01; // Base roughness for terrain
let roughnessIncrement = 0.001; // How quickly the roughness increases over time

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(10, 10, 50); 
  drawTerrain();  
  start += inc * 0.5; // Increment offset for Perlin noise
  roughness += roughnessIncrement; // Increment roughness over time
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
  generateTerrainVertices(); // Draw sky
  vertex(width, 0); 
  endShape(CLOSE);
}

function drawGround() {
  fill(139, 69, 19); 
  noStroke();
  beginShape();
  vertex(0, height); 
  generateTerrainVertices(); // Draw ground
  vertex(width, height); 
  endShape(CLOSE);
}

function generateTerrainVertices() {
  let xoff = start;
  for (let x = 0; x < width; x++) {
    let y = noise(xoff * roughness) * height / 2 + height / 2;
    vertex(x, y);
    xoff += inc;
  }
}
