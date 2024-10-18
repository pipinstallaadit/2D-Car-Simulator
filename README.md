
# **Car Evolution Simulation with Genetic Algorithms**

Welcome to the **Car Evolution Simulation**! This project demonstrates how genetic algorithms evolve car designs over generations in a 2D terrain environment using JavaScript, HTML, and CSS. The simulation models a car's evolution based on its performance, adapting its shape, wheel size, and other features to maximize its travel distance over rugged terrain.

<!-- ![Car Evolution Simulation Banner](path/to/your/banner-image.png) -->

## **🚀 Project Overview**

This project simulates the evolution of cars using genetic algorithms. Cars are randomly generated and tested over procedurally generated terrain. Each generation of cars improves based on the performance of the previous generation, resulting in cars that can navigate increasingly difficult terrain.

### **🌟 Features**
- **Genetic Algorithm**: Evolve cars over multiple generations.
- **2D Physics Simulation**: Cars are modeled using physics principles with terrain generation.
- **Modular Code Structure**: The code is split into multiple modules for maintainability and readability.
- **User Input Controls**: Customize the number of cars, mutation rate, and other parameters via the interface.

## **🔧 Setup and Installation**

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/your-username/2D-Car-Simulator.git]
   cd Car-Evolution-Simulation
   ```

2. **Open `index.html`** in your browser. The simulation will run directly as it's a client-side project. No additional dependencies are required!

3. **Optional**: Customize the genetic algorithm settings like the number of cars, mutation rate, and generations directly through the UI controls.

## **🖥️ Usage**

- **Start the Simulation**: Click the **Start** button after adjusting the parameters (like the number of cars or mutation rate) in the control panel.
- **Watch the Evolution**: Observe the cars' evolution as the algorithm iterates over generations, improving the car designs to navigate the terrain better.
- **Adjust Parameters**: You can modify parameters like the number of cars and mutation rates to see how they affect the evolution process.

## **📚 Code Explanation**

Each module in the codebase has a specific purpose:

1. **`main.js`**: Manages the initialization and setup of the simulation, event listeners, and the main control flow.
2. **`terrain.js`**: Contains functions to create and manage the terrain over which the cars will travel.
3. **`car.js`**: Handles the car generation, evolution logic, and fitness calculations for genetic algorithms.
4. **`render.js`**: Manages the rendering of cars and terrain using p5.js, ensuring the simulation updates visually.
5. **`genetics.js`**: Implements the genetic algorithm, including crossover, mutation, and genome generation.
6. **`utils.js`**: Provides utility functions such as random number generation, physics calculations, and more.

## **🧩 Tech Stack**

| Technology    | Description                                     | Link                                    |
|---------------|-------------------------------------------------|----------------------------------------|
| **JavaScript**| Core programming language for the simulation.   | [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  |
| **HTML**      | Markup language for structuring the interface.  | [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)              |
| **CSS**       | Stylesheet language for styling the interface.  | [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)                |
| **Planck.js** | Lightweight 2D physics engine for car dynamics. | [Planck.js](https://github.com/shakiba/planck.js)                      |
| **p5.js**     | Creative coding library used for rendering.     | [p5.js](https://p5js.org/)                                            |
| **GitHub**    | Version control and code hosting platform.      | [GitHub](https://github.com/)                                          |

## **🎨 Visuals**

Here's how the UI is structured:

- **Canvas Area**: Displays the cars and terrain in real-time as they evolve.
- **Control Panel**: Adjust simulation parameters like:
  - Number of cars per generation
  - Mutation rate
  - Maximum generations

## **📂 File Structure**

Here's the organized file structure for the project:

```plaintext
📦 Car-Evolution-Simulation
│
├── 📁 main-project
│   ├── 📁 src
│   │   ├── main.js         # Initializes the simulation and handles setup
│   │   ├── terrain.js      # Handles terrain generation and management
│   │   ├── car.js          # Manages car creation, evolution, and genetic algorithms
│   │   ├── render.js       # Responsible for rendering cars and terrain
│   │   ├── genetics.js     # Genetic algorithm functions for car genomes
│   │   └── utils.js        # Utility functions for the simulation
│   │
│   ├── 📁 assets
│   │   ├── styles.css      # Styling for the simulation UI
│   │
│   ├── index.html          # The main HTML file containing the canvas and UI elements
│   ├── Note.md             # Note regarding the filestructure
|    
├── 📁 mini-projects        
│   ├── 📁 mini-project-1
│   │   ├── src             # Source code for mini project 1
│   │   ├── assets          # Assets specific to mini project 1
│   │   ├── index.html      # Entry point for mini project 1
│   │   └── README.md       # Documentation specific to mini project 1
│   │
│   ├── 📁 mini-project-2
│   │   ├── src             # Source code for mini project 2
│   │   ├── assets          # Assets specific to mini project 2
│   │   ├── index.html      # Entry point for mini project 2
│   │   └── README.md       # Documentation specific to mini project 2
│   │
│   └── 📁 mini-project-3
│       ├── src             # Source code for mini project 3
│       ├── assets          # Assets specific to mini project 3
│       ├── index.html      # Entry point for mini project 3
│       └── README.md       # Documentation specific to mini project 3
│
├── README.md               # Project documentation (You're reading this!)

```

<!-- **Screenshots**:
1. **Simulation in Action**:
   ![Simulation Running](path/to/your/simulation-screenshot.png)

2. **Control Panel**:
   ![Control Panel](path/to/your/control-panel-screenshot.png) -->

## **🔄 How the Genetic Algorithm Works**

1. **Initialization**: A set of cars is randomly generated with different chassis shapes and wheel sizes.
2. **Evaluation**: Each car's performance (distance traveled) is evaluated.
3. **Selection**: The top-performing cars are selected as parents.
4. **Crossover and Mutation**:
   - **Crossover**: Combines genetic traits from two parent cars to create offspring.
   - **Mutation**: Applies random changes to offspring cars to introduce new traits.
5. **Evolution**: The new generation of cars is tested, and the process repeats.

## **🚧 Future Improvements**

- **Enhanced UI**: Add graphs and real-time data visualization for car performance.
- **Better Models of Cars**: Make more realistic car models.
- **Terrain Customization**: Allow users to create their own terrains.
- **Improved Physics**: Refine the physics engine to create more realistic car behavior.

## **📜 License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## **🤝 Contributing**

Contributions are welcome! Feel free to open issues, submit pull requests, or suggest features. For major changes, please open a discussion first.

---

I hope you enjoy exploring the evolution of cars through genetic algorithms!
<!-- 
![Footer Image](path/to/your/footer-image.png) -->
