// Constants and Configuration
const planck = window.planck;
const Vec2 = planck.Vec2;

// Simulation Scale and World Parameters
const SCALE = 30;                    // Pixels per meter for rendering
const CATEGORY_CAR = 0x0002;         // Collision category for cars
const CATEGORY_TERRAIN = 0x0004;     // Collision category for terrain
const ACCELERATION_FORCE = 3;        // Force applied to cars for movement

// Global State Variables
let world;                          // Physics world instance
let cars = [];                      // Array of car objects
let terrainVertices = [];           // Array of terrain vertices
let groundBody;                     // Physics body for the ground
let isRunning = true;               // Simulation running state
let allTimeLeadingDistance = 0;     // Best distance achieved across all generations

// Terrain Generation Parameters
let inc = 0.0035;                   // Noise increment for terrain generation
let start = 0;                      // Starting point for noise generation

// Genetic Algorithm Parameters
let generation = 0;                 // Current generation counter
let maxGenerations = 100;           // Maximum number of generations
let mutationRate = 0.20;            // Probability of mutation
let numCars = 10;                   // Number of cars per generation

// Car Physics Parameters
let maxVelocity = 5;               // Maximum velocity for cars
let chassisRadius = 10;            // Radius of car chassis
let wheelRadius = 10;              // Radius of car wheels

/**
 * Initial setup function - Called when simulation starts
 */
function setup() {
    // Reset simulation parameters
    generation = 0;
    allTimeLeadingDistance = 0;

    // Get user inputs from DOM
    numCars = parseInt(document.getElementById('numCars').value);
    mutationRate = parseFloat(document.getElementById('mutationRate').value);
    maxGenerations = parseInt(document.getElementById('maxGenerations').value);
    chassisRadius = parseFloat(document.getElementById('chassisRadius').value);
    wheelRadius = parseFloat(document.getElementById('wheelRadius').value);

    // Set global window variables
    Object.assign(window, {
        numCars,
        mutationRate,
        maxGenerations,
        chassisRadius,
        wheelRadius
    });

    // Create and center canvas
    canvas = createCanvas(800, 400);
    centerCanvas();

    // Initialize physics world
    world = planck.World(Vec2(0, -10));
    terrainVertices = [];
    generateTerrain();
    groundBody = world.createBody();
    createGround();

    generateRandomCars(numCars);
    loop();
}

/**
 * Centers the canvas in the window
 */
function centerCanvas() {
    let x = (windowWidth - width/2) / 1.60;
    let y = (windowHeight - height) / 3;
    canvas.position(x, y);
}

/**
 * Handles window resize events
 */
function windowResized() {
    centerCanvas();
}

/**
 * Main draw loop - Handles simulation updates and rendering
 */
function draw() {
    if (!isRunning) return;

    background(135, 206, 235);   // Sky blue background
    world.step(1 / 60);         // Update physics

    let allCarsStopped = true;
    cars.forEach(car => {
        updateCarFitness(car);
        
        if (car.body.getLinearVelocity().x > 0.001) {
            allCarsStopped = false;
        }

        // Apply forces to car
        let forwardDirection = car.body.getWorldVector(planck.Vec2(1, 0));
        car.body.applyForce(forwardDirection.mul(ACCELERATION_FORCE), car.body.getWorldCenter());

        // Update wheel rotation
        let chassisVelocity = car.body.getLinearVelocity().x;
        car.wheels.forEach(wheel => {
            let wheelRadius = wheel.getFixtureList().getShape().getRadius();
            let wheelAngularVelocity = chassisVelocity / wheelRadius;
            wheel.setAngularVelocity(-wheelAngularVelocity);
        });
    });

    if (allCarsStopped) {
        evolveNextGeneration();
    }

    // Camera and rendering updates
    let leadingCar = findLeadingCar();
    let carPositionX = leadingCar.body.getPosition().x * SCALE;
    let leadingCarDistance = findLeadingCarDistance(leadingCar);
    
    if (leadingCarDistance > allTimeLeadingDistance) {
        allTimeLeadingDistance = leadingCarDistance;
    }

    // Camera translation
    let translateX = width / 4 - carPositionX;
    
    push();
    translate(translateX, 0);
    
    if (carPositionX > (terrainVertices[terrainVertices.length - 1].x * SCALE - width)) {
        generateMoreTerrain();
        createGround();
    }

    drawTerrain();
    cars.forEach(car => drawCar(car));
    pop();

    // Update displays
    displayGenerationInfo();
    document.getElementById('bestCarDistance').textContent = leadingCarDistance.toFixed(2) + ' meters';
    document.getElementById('allTimeLeadingDistance').textContent = allTimeLeadingDistance.toFixed(2) + ' meters';
    displayCarParameters();
}

/**
 * Displays parameters of the leading car
 */
function displayCarParameters() {
    let leadingCar = findLeadingCar();
    
    // Format and display chassis vertices
    let chassisVertices = leadingCar.genome.chassisVertices
        .map(v => `(${v.x.toFixed(2)}, ${v.y.toFixed(2)})`)
        .join(', ');
    document.getElementById('chassisVertices').textContent = chassisVertices;

    // Format and display wheel sizes
    let wheelSizes = leadingCar.genome.wheelSizes
        .map(s => s.toFixed(2))
        .join(', ');
    document.getElementById('wheelSizes').textContent = wheelSizes;

    // Format and display wheel positions
    let wheelPositions = leadingCar.genome.wheelPositions
        .map(w => `(${w.x.toFixed(2)}, ${w.y.toFixed(2)})`)
        .join(', ');
    document.getElementById('wheelPositioning').textContent = wheelPositions;

    // Calculate and display chassis radius
    let chassisRadius = Math.max(
        ...leadingCar.genome.chassisVertices.map(
            v => Math.sqrt(v.x * v.x + v.y * v.y)
        )
    );
    document.getElementById('chassisRadius').textContent = 
        chassisRadius.toFixed(2) + ' meters';
}

/**
 * Finds the car that has traveled the furthest
 * @returns {Object} The leading car object
 */
function findLeadingCar() {
    return cars.reduce((leader, car) => {
        return car.body.getPosition().x > leader.body.getPosition().x ? car : leader;
    }, cars[0]);
}

/**
 * Calculates the distance traveled by the leading car
 * @param {Object} leadingCar - The leading car object
 * @returns {number} Distance traveled in simulation units
 */
function findLeadingCarDistance(leadingCar) {
    return leadingCar.body.getPosition().x * SCALE;
}

/**
 * Generates additional terrain as cars progress
 */
function generateMoreTerrain() {
    let lastVertex = terrainVertices[terrainVertices.length - 1];
    let xoff = start + lastVertex.x * inc * SCALE;

    let difficulty = lastVertex.x * 0.004;
    let amplitude = height * 0.5 + height * difficulty;
    let frequency = inc + difficulty * 0.0005;

    for (let x = lastVertex.x * SCALE + 1; x < lastVertex.x * SCALE + width; x++) {
        let y = noise(xoff) * amplitude + height * 0.25;
        terrainVertices.push({
            x: x / SCALE,
            y: (height - y) / SCALE
        });
        xoff += frequency;
    }

    start += frequency;
}

/**
 * Generates initial terrain
 */
function generateTerrain() {
    let xoff = start;
    for (let x = 0; x < width; x++) {
        let y = noise(xoff) * height * 0.5 + height * 0.25;
        terrainVertices.push({
            x: x / SCALE,
            y: (height - y) / SCALE
        });
        xoff += inc;
    }
    start += inc;
}

/**
 * Creates ground physics body from terrain vertices
 */
function createGround() {
    groundBody = world.createBody();
    for (let i = 0; i < terrainVertices.length - 1; i++) {
        let v1 = Vec2(terrainVertices[i].x, terrainVertices[i].y);
        let v2 = Vec2(terrainVertices[i + 1].x, terrainVertices[i + 1].y);
        groundBody.createFixture(planck.Edge(v1, v2), {
            friction: 0.6,
            filterCategoryBits: CATEGORY_TERRAIN,
            filterMaskBits: CATEGORY_CAR,
        });
    }
}

/**
 * Generates initial population of cars
 * @param {number} numCars - Number of cars to generate
 */
function generateRandomCars(numCars) {
    cars = Array(numCars).fill(null).map(() => {
        let genome = generateRandomGenome();
        return generateCarFromGenome(genome);
    });
}

/**
 * Generates random genome for car
 * @returns {Object} Genome object containing car properties
 */
function generateRandomGenome() {
    let numVertices = 6;
    let chassisVertices = Array(numVertices).fill(null).map((_, i) => {
        let angle = i * TWO_PI / numVertices;
        let radius = random(10, window.chassisRadius) / SCALE;
        return Vec2(Math.cos(angle) * radius, Math.sin(angle) * radius);
    });

    return {
        chassisVertices,
        wheelSizes: [
            random(5, window.wheelRadius) / SCALE,
            random(5, window.wheelRadius) / SCALE
        ],
        wheelPositions: [
            Vec2(random(-0.5, 0.5), random(-0.2, 0.2)),
            Vec2(random(-0.5, 0.5), random(-0.2, 0.2))
        ]
    };
}

/**
 * Creates a car from a genome
 * @param {Object} genome - Genome object containing car properties
 * @returns {Object} Car object with physics bodies and properties
 */
function generateCarFromGenome(genome) {
    let carStartX = 100 / SCALE;
    let carY = getYPositionAtX(carStartX) + 20 / SCALE;

    let carBody = world.createBody({
        type: 'dynamic',
        position: Vec2(carStartX, carY),
        angularDamping: 5.0,
    });

    if (!genome.chassisVertices || genome.chassisVertices.length <= 2) {
        console.error('Invalid chassis vertices:', genome.chassisVertices);
        return null;
    }

    carBody.createFixture(planck.Polygon(genome.chassisVertices), {
        density: 1.0,
        friction: 0.3,
        filterCategoryBits: CATEGORY_CAR,
        filterMaskBits: CATEGORY_TERRAIN,
    });

    let wheels = genome.wheelSizes.map((size, i) => {
        let wheelPosition = genome.wheelPositions[i];
        let wheel = createWheel(
            Vec2(carStartX + wheelPosition.x, carY + wheelPosition.y),
            size
        );
        
        world.createJoint(planck.RevoluteJoint({},
            carBody,
            wheel,
            Vec2(carStartX + wheelPosition.x, carY + wheelPosition.y)
        ));
        
        return wheel;
    });

    carBody.applyForceToCenter(Vec2(4, 0));

    return {
        body: carBody,
        wheels: wheels,
        fitness: 0,
        genome: genome
    };
}

/**
 * Creates a wheel body
 * @param {Vec2} position - Position of the wheel
 * @param {number} wheelSize - Radius of the wheel
 * @returns {Object} Wheel physics body
 */
function createWheel(position, wheelSize) {
    let wheel = world.createBody({
        type: 'dynamic',
        position: position,
    });

    wheel.createFixture(planck.Circle(wheelSize), {
        density: 1.0,
        friction: 0.9,
        restitution: 0.1,
        filterCategoryBits: CATEGORY_CAR,
        filterMaskBits: CATEGORY_TERRAIN,
    });

    return wheel;
}

/**
 * Gets Y position at given X coordinate on terrain
 * @param {number} x - X coordinate
 * @returns {number} Y coordinate on terrain
 */
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

/**
 * Draws the terrain
 */
function drawTerrain() {
    fill(139, 69, 19);
    noStroke();
    beginShape();
    vertex(terrainVertices[0].x * SCALE, height);
    terrainVertices.forEach(v => {
        vertex(v.x * SCALE, height - v.y * SCALE);
    });
    vertex(terrainVertices[terrainVertices.length - 1].x * SCALE, height);
    endShape(CLOSE);
}

/**
 * Draws a physics body
 * @param {Object} body - Physics body to draw
 * @param {color} colorValue - Color to use for drawing
 */
function drawBody(body, colorValue) {
    push();
    translate(body.getPosition().x * SCALE, height - body.getPosition().y * SCALE);
    rotate(-body.getAngle());
    fill(colorValue);

    for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
        const shape = fixture.getShape();
        if (shape.getType() === 'circle') {
            drawCircle(shape);
        } else if (shape.getType() === 'polygon') {
            drawPolygon(shape);
        }
    }

    pop();
}
/**
 * Draws a car
 * @param {Object} car - Car object to draw
 */
function drawCar(car) {
    if (!car) return;
    drawBody(car.body, color(255, 0, 0));  // Red chassis
    car.wheels.forEach(wheel => {
        drawBody(wheel, color(0));  // Black wheels
    });
}

/**
 * Draws a circle shape
 * @param {Object} shape - Circle shape to draw
 */
function drawCircle(shape) {
    let radius = shape.getRadius() * SCALE;
    ellipse(0, 0, radius * 2, radius * 2);
}

/**
 * Draws a polygon shape
 * @param {Object} shape - Polygon shape to draw
 */
function drawPolygon(shape) {
    beginShape();
    const vertices = shape.m_vertices;
    vertices.forEach(v => {
        vertex(v.x * SCALE, -v.y * SCALE);
    });
    endShape(CLOSE);
}

/**
 * Updates car fitness based on distance traveled
 * @param {Object} car - Car to update
 */
function updateCarFitness(car) {
    let carPositionX = car.body.getPosition().x;
    car.fitness = carPositionX * SCALE;
}

/**
 * Evolves the population to create the next generation
 */
function evolveNextGeneration() {
    generation++;
    console.log(`Evolving to generation ${generation}`);

    // Sort cars by fitness and select top performers
    let sortedCars = cars.filter(car => car !== null)
                        .sort((a, b) => b.fitness - a.fitness);
    let bestCars = sortedCars.slice(0, numCars / 2);

    if (bestCars.length === 0) {
        console.error('No cars available to evolve.');
        noLoop();
        return;
    }

    // Create new generation
    let newCars = [];
    for (let i = 0; i < numCars; i++) {
        let parentA = random(bestCars);
        let parentB = random(bestCars);
        let offspringGenome = crossover(parentA.genome, parentB.genome);
        mutate(offspringGenome);
        let offspringCar = generateCarFromGenome(offspringGenome);
        if (offspringCar) {
            newCars.push(offspringCar);
        }
    }

    cars = newCars;
    console.log(`Generation ${generation} evolved. Best fitness: ${sortedCars[0].fitness}`);

    // Reset ground for new generation
    world.destroyBody(groundBody);
    groundBody = world.createBody();
    createGround();
}

/**
 * Performs crossover between two parent genomes
 * @param {Object} parentAGenome - First parent's genome
 * @param {Object} parentBGenome - Second parent's genome
 * @returns {Object} Child genome
 */
function crossover(parentAGenome, parentBGenome) {
    let childGenome = {};

    // Crossover chassis vertices
    childGenome.chassisVertices = parentAGenome.chassisVertices.map((vertex, i) =>
        random() < 0.5 ? 
            Vec2(vertex.x, vertex.y) : 
            Vec2(parentBGenome.chassisVertices[i].x, parentBGenome.chassisVertices[i].y)
    );

    // Crossover wheel sizes
    childGenome.wheelSizes = parentAGenome.wheelSizes.map((size, i) =>
        random() < 0.5 ? size : parentBGenome.wheelSizes[i]
    );

    // Crossover wheel positions
    childGenome.wheelPositions = parentAGenome.wheelPositions.map((pos, i) =>
        random() < 0.5 ? 
            Vec2(pos.x, pos.y) : 
            Vec2(parentBGenome.wheelPositions[i].x, parentBGenome.wheelPositions[i].y)
    );

    return childGenome;
}

/**
 * Mutates a genome based on mutation rate
 * @param {Object} genome - Genome to mutate
 */
function mutate(genome) {
    // Mutate chassis vertices
    genome.chassisVertices.forEach(vertex => {
        if (random() < mutationRate) {
            vertex.x += random(-0.05, 0.05);
            vertex.y += random(-0.05, 0.05);
        }
    });

    // Mutate wheel sizes
    genome.wheelSizes.forEach((size, i) => {
        if (random() < mutationRate) {
            genome.wheelSizes[i] += random(-0.02, 0.02);
            genome.wheelSizes[i] = constrain(genome.wheelSizes[i], 0.05, 0.4);
        }
    });

    // Mutate wheel positions
    genome.wheelPositions.forEach(pos => {
        if (random() < mutationRate) {
            pos.x += random(-0.05, 0.05);
            pos.y += random(-0.05, 0.05);
        }
    });
}

/**
 * Updates generation information display
 */
function displayGenerationInfo() {
    document.getElementById('currentGeneration').textContent = generation;
}

// Event Listeners
document.getElementById('startButton').addEventListener('click', function() {
    generation = 0;
    allTimeLeadingDistance = 0;
    setup();
});

document.getElementById('pauseButton').addEventListener('click', function() {
    if (isRunning) {
        noLoop();
        this.textContent = "Resume Simulation";
    } else {
        loop();
        this.textContent = "Pause Simulation";
    }
    isRunning = !isRunning;
});
