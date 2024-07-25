function newChar() {
  let c = Math.floor(Math.random() * (127 - 32 + 1)) + 32;
  return String.fromCharCode(c);
}
  
  // Constructor (makes a random DNA)
  class DNA {
    constructor(num) {
      // The genetic sequence
      this.genes = [];
      this.fitness = 0;
      for (let i = 0; i < num; i++) {
        this.genes[i] = newChar(); // Pick from range of chars
      }
    }
  
    // Converts character array to a String
    getPhrase() {
      return this.genes.join("");
    }
  
    // Fitness function (returns floating point % of "correct" characters)
    calcFitness(target) {
      let score = 0;
      for (let i = 0; i < this.genes.length; i++) {
        if (this.genes[i] == target.charAt(i)) {
          score++;
        }
      }
      this.fitness = score / target.length;
    }
  
    // Crossover
    crossover(partner) {
      // A new child
      let child = new DNA(this.genes.length);
  
      let midpoint = floor(random(this.genes.length)); // Pick a midpoint
  
      // Half from one, half from the other
      for (let i = 0; i < this.genes.length; i++) {
        if (i > midpoint) child.genes[i] = this.genes[i];
        else child.genes[i] = partner.genes[i];
      }
      return child;
    }
  
    // Based on a mutation probability, picks a new random character
    mutate(mutationRate) {
      for (let i = 0; i < this.genes.length; i++) {
        if (random(1) < mutationRate) {
          this.genes[i] = newChar();
        }
      }
    }
  }
  