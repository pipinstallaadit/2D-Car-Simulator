# 🧬 Genetic Algorithm Phrase Evolution Mini Project

This mini project showcases the application of genetic algorithms to evolve a specific phrase over generations. The project attempts to generate the target phrase "To be or not to be" using a population of randomly generated characters, applying selection, crossover, and mutation.

## 🎨 Project Overview

The project uses the p5.js library to visualize the evolution of phrases on a canvas. Each generation of phrases is evaluated for fitness based on how closely they match the target phrase. The best phrases are selected for reproduction, gradually evolving towards the target phrase.

![Phrase Evolution Screenshot](path/to/your/phrase-screenshot.png)

## 🌟 Features

- **Evolving Phrases**: The algorithm evolves phrases over generations to match the target phrase.
- **Dynamic Visualization**: Real-time updates of the best phrase generated in each generation.
- **Genetic Algorithm Mechanics**: Implements selection, crossover, and mutation processes for phrase evolution.

## 📂 File Structure

```plaintext
📦 genetic-algorithm-phrase-evolution-mini-project
│
├── index.html          # The main HTML file to run the project
├── styles.css          # (Optional) CSS styles for the canvas and layout
├── script.js           # JavaScript file containing the genetic algorithm code
├── jsconfig.json       # Configuration file for JavaScript projects
└── libraries           # Folder containing external libraries
    ├── p5.min.js       # p5.js library for graphics and animations
    └── p5.sound.min.js # p5.js sound library for audio functions
