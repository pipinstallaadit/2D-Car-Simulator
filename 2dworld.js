let inc = 0.0035;
let start = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  // Background color for the sky (blue)
  background(202, 244, 255);
  
  // Variables to store the vertices of the wave line
  let waveVertices = [];

  // Calculate the y-coordinates using Perlin noise and store vertices
  let xoff = start;
  for (let x = 0; x < width; x++) {
    let y = noise(xoff) * height;
    waveVertices.push({ x: x, y: y });
    xoff += inc;
  }

  // Draw brown ground below the wavy line
  fill(140,59,12);  // RGB color for brown
   
  noStroke();
  beginShape();
  vertex(0, height);  // Bottom-left corner
  for (let i = 0; i < waveVertices.length; i++) {
    vertex(waveVertices[i].x, waveVertices[i].y);
  }
  vertex(width, height);  // Bottom-right corner
  endShape(CLOSE);
  // Increment start for moving wave effect
  start += inc;
}

