---
name: node-scaffolding
description: Automates the setup of a modern Node.js application with Express, TypeScript, Jest, and API integration. Provides a quick scaffold with essential features and configurations for building a new Node.js application from scratch.
---

# Project Scaffolding Skill

This skill automates the setup of a modern Node.js API application with Express, TypeScript, Jest, dotenv, and a joke endpoint.

## Features

- Node.js project initialization
- Express, CORS, dotenv integration
- TypeScript setup and configuration
- Jest and Supertest for testing
- .env and .gitignore setup
- Health and brand endpoints

## Use this skill when

- Building a new Node.js API application from scratch
- Setting up a modern backend stack with best practices
- You want a quick scaffold with essential features and configurations

## Do not use this skill when

- You only need frontend architecture

## Instructions

- Run the scaffolding script (`./scripts/project-scaffolding.sh`) in terminal without any deviation.
- Run the API server using `cd api && npm run start` to ensure it is running correctly.
- Test the application by doing a GET request to `http://localhost:3001/api/brand`.
- Kill the API server using `Ctrl + C` in the terminal when done testing.
