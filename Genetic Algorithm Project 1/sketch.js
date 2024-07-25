// Variables for genetic algorithm
let target;
let popmax;
let mutationRate;
let population;

// Variables for displaying best phrase and stats
let bestPhrase;
let stats;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize genetic algorithm parameters
  target = "Genetic Algorithm";
  popmax = 200;
  mutationRate = 0.01;
  
  // Initialize population
  population = new Population(target, mutationRate, popmax);
}

function draw() {
  // Genetic algorithm operations
  population.naturalSelection(); // Generate mating pool
  population.generate(); // Create next generation
  population.calcFitness(); // Calculate fitness
  population.evaluate(); // Evaluate population
  
  // Break after target phrase is achieved
  if (population.isFinished()) {
    noLoop();
  }
  
  // Display background and best phrase
  background(1);
  
  let answer = population.getBest();
  fill(255);
  textFont("Courier");
  textSize(52);
  text("Best phrase:", 10, height/4);
  textSize(54);
  text(answer, 10, height/3.8 + 50);
  
  // Display statistics
  let statstext =
    "Total Generations:     " + population.getGenerations() + "\n" +
    "Average Fitness:       " + nf(population.getAverageFitness(), 0, 2) * 100 + "%"+"\n" +
    "Total Population:      " + popmax + "\n" +
    "Mutation Rate:         " + floor(mutationRate * 100) + "%";
  
  textSize(32);
  fill(125);
  text(statstext, 10, height/2.5 );
  textSize(24);
  fill(50); // White (RGB)
  text(population.allPhrases(), 650, 84); // Display all phrases 
}
