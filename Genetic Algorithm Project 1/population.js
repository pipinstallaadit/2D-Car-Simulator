class Population {
  constructor(p, m, num) {
    this.population = []; // Current population
    this.matingPool = []; // For matingpool
    this.generations = 0; // Number of generations
    this.finished = false; // Break the loop
    this.target = p; // Target phrase
    this.mutationRate = m; // Mutation rate
    this.perfectScore = 1;
    this.best = "";

    // Initialize population with random DNA objects
    for (let i = 0; i < num; i++) {
      this.population[i] = new DNA(this.target.length);
    }

    this.calcFitness(); // Calculate initial fitness
  }

  // Calculate fitness for each member of the population
  calcFitness() {
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].calcFitness(this.target);
    }
  }

  // Generate the mating pool based on fitness
  naturalSelection() {
    this.matingPool = []; 
    let maxFitness = 0;
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > maxFitness) {
        maxFitness = this.population[i].fitness;
      }
    }

    for (let i = 0; i < this.population.length; i++) {
      let fitness = map(this.population[i].fitness, 0, maxFitness, 0, 1);  // if fitness value= 0.5 
      let n = floor(fitness * 100);                                        // n = math.floor(0.5*100) = 50
      for (let j = 0; j < n; j++) {                                        // thus phrase pushed 50 times
        this.matingPool.push(this.population[i]);
      }
    }
  }

  // Generate a new generation from the mating pool
  generate() {
    for (let i = 0; i < this.population.length; i++) {
      let a = floor(random(this.matingPool.length));
      let b = floor(random(this.matingPool.length));
      let partnerA = this.matingPool[a];
      let partnerB = this.matingPool[b];
      let child = partnerA.crossover(partnerB); // Crossover
      child.mutate(this.mutationRate); // Mutation
      this.population[i] = child;
    }
    this.generations++;
  }

  // Get the best phrase in the current population
  getBest() {
    return this.best;
  }

  // Evaluate the fitness of the population and update best phrase
  evaluate() {
    let worldRecord = 0.0;
    let index = 0;
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > worldRecord) {
        index = i;
        worldRecord = this.population[i].fitness;
      }
    }

    this.best = this.population[index].getPhrase();
    if (worldRecord === this.perfectScore) {
      this.finished = true;
    }
  }

  // Check if evolution is finished
  isFinished() {
    return this.finished;
  }

  // Get the number of generations
  getGenerations() {
    return this.generations;
  }

  // Compute the average fitness of the population
  getAverageFitness() {
    let total = 0;
    for (let i = 0; i < this.population.length; i++) {
      total += this.population[i].fitness;
    }
    return total / this.population.length;
  }

  // Return all phrases in the population (for display purposes)
  allPhrases() {
    let everything = "";

    let displayLimit = min(this.population.length, 51);

    for (let i = 0; i < displayLimit; i++) {
      everything += this.population[i].getPhrase();
      if (i % 3 === 2) everything += "\n"; // Add newline every 3 phrases
      else everything += " ";
    }
    return everything;
  }
}
