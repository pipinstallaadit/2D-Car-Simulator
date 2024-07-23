let mutationrate = 0.01;
let populationsize= 150;
let population = [];
let target = "To be or not to be";

function setup (){
  createCanvas(640,360);

  for (let i = 0 ; i < populationsize ; i++)
  {
     population [i] = new DNA(target.length)
  }   
}

function draw() {
  for (let phrase of population) {
      phrase.calculatefitness(target);
  }

  let matingpool = [];
  for (let phrase of population) {
      let n = Math.floor(phrase.fitness * 100);
      for (let j = 0; j < n; j++) {
          matingpool.push(phrase);
      }
  }

  for (let i = 0; i < population.length; i++) {
      let parentA = random(matingpool);
      let parentB = random(matingpool);

      let child = parentA.crossover(parentB);
      child.mutate(mutationrate);
      population[i] = child;
  }

 
  let bestPhrase = getBestPhrase();
  console.log("Best phrase: " + bestPhrase.getphrase());


  background(255);
  fill(0);
  textSize(16);
  text(bestPhrase.getphrase(), 10, 30);
}

class DNA {
  constructor(length) {
      this.genes = [];
      for (let i = 0; i < length; i++) {
          this.genes[i] = randomcharacter();
      }
      this.fitness = 0;
  }

  getphrase() {
      return this.genes.join("");
  }

  calculatefitness(target) {
      let score = 0;
      for (let i = 0; i < this.genes.length; i++) {
          if (this.genes[i] === target.charAt(i)) {
              score++;
          }
      }
      this.fitness = score / target.length;
  }

  crossover(partner) {
      let child = new DNA(this.genes.length);
      let midpoint = Math.floor(Math.random() * this.genes.length);
      for (let i = 0; i < this.genes.length; i++) {
          if (i < midpoint) {
              child.genes[i] = this.genes[i];
          } else {
              child.genes[i] = partner.genes[i];
          }
      }
      return child;
  }

  mutate(mutationrate) {
      for (let i = 0; i < this.genes.length; i++) {
          if (Math.random() < mutationrate) {
              this.genes[i] = randomcharacter();
          }
      }
  }
}

function randomcharacter() {
  let c = Math.floor(Math.random() * (127 - 32 + 1)) + 32;
  return String.fromCharCode(c);
}

function getBestPhrase() {
  let maxFitness = 0;
  let bestPhrase;
  for (let phrase of population) {
      if (phrase.fitness > maxFitness) {
          maxFitness = phrase.fitness;
          bestPhrase = phrase;
      }
  }
  return bestPhrase;
}
