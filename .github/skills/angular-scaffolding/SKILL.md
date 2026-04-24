---
name: angular-scaffolding
description: Automates the setup of a modern Angular web application with Tailwind CSS, Jest, SSR, and API integration. Provides a quick scaffold with essential features and configurations for building a new Angular web application from scratch.
---

# Project Scaffolding Skill

This skill automates the setup of a modern Angular web application with Tailwind CSS, Jest, SSR, and API integration.

## Features

- Angular CLI project creation
- Tailwind CSS v3 integration
- Jest testing setup
- SSR (Server Side Rendering) enabled
- .env configuration
- API configuration service and interceptor
- Home component with "hello world" and brand fetching

## Use this skill when

- Building a new Angular web application from scratch
- Setting up a modern frontend stack with best practices
- You want a quick scaffold with essential features and configurations

## Do not use this skill when

- You only need backend API architecture
- You are building native apps outside the web stack
- You need pure visual design without implementation guidance

## Instructions

- Run the scaffolding script (`./scripts/project-scaffolding.sh`) without any deviation.
- Add a navigation header as part of the application scaffold.
- Generate a brand service that fetches the brand name from the API.
- Generate a home component that displays a brand name from the brand service.
- Run `npm run test` to ensure that everything is set up correctly and that the tests are passing.
