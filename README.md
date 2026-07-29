# Startup Connect

Startup Connect is an AI-powered platform designed to empower self-employed individuals and employees transitioning their skills into businesses. Unlike traditional startup accelerators, it focuses on grassroots entrepreneurs (e.g., carpenters building custom furniture businesses, dress designers launching online boutiques, freelancers scaling services). 

The platform acts as a "co-pilot" through a chat-based AI-Guided User Interface (AGUI), where users communicate naturally in their native language, and the AI handles navigation, processes, and actions without requiring users to learn a complex interface.

## 🚀 Key Features

- **AI Co-Pilot and Chat-Based AGUI**: Conversational interface for navigating the platform, generating content, and taking actions.
- **Auto-Generation of Business Assets**: Automatically generate pitch decks, logos, videos, and business documents using AI (integrated with Gemini Pro, Nano Banana, Veo 3.1).
- **AI-Generated Static Webpages**: Quick, personalized online presence generated in seconds.
- **AI-Driven Collaboration Matching**: Connects businesses based on complementary strengths and weaknesses for partnerships or mergers.
- **Market Insight Engine**: Proactively identifies trends and suggests pivots or protections.
- **Exit Strategy Assistance**: Helps mitigate losses by suggesting sales of utilities/assets to competitors/partners.

## 🛠 Tech Stack

- **Frontend**: Angular 19, Tailwind CSS, Socket.IO Client
- **Backend**: Java 21, Spring Boot (WebMVC, WebFlux, Security, Data MongoDB, Data Redis), Netty SocketIO, JWT
- **Databases**: MongoDB, Redis (via Docker)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Java Development Kit (JDK) 21**
- **Node.js** (v18+ recommended) and **npm**
- **Angular CLI** (`npm install -g @angular/cli`)
- **Docker** & **Docker Compose** (for running MongoDB and Redis)

## 🏁 How to Start

Follow these steps to run the project locally.

### 1. Start the Databases
The project uses Docker to manage MongoDB and Redis containers.

```bash
# In the root directory of the project
docker-compose up -d
```
This will start MongoDB on port `27017` and Redis on port `6379`.

### 2. Start the Backend
The backend is a Spring Boot application using Maven.

```bash
# Navigate to the backend directory
cd backend

# Run the application using the Maven wrapper
./mvnw spring-boot:run
```
*(On Windows, you can use `mvnw.cmd spring-boot:run`)*

### 3. Start the Frontend
The frontend is built with Angular.

```bash
# Navigate to the frontend directory
cd frontend

# Install the dependencies
npm install

# Start the Angular development server
npm start
```
The frontend application will be available at `http://localhost:4200/`.

## 📂 Project Structure

- `/backend`: Spring Boot application containing all REST APIs and WebSocket logic.
- `/frontend`: Angular 19 application containing the UI and chat integrations.
- `docker-compose.yml`: Configuration for running local MongoDB and Redis instances.
- `Project-Docs.md` / `Design-Docs.md`: Detailed documentation on the platform's vision, architecture, and design thinking approach.

## 🤝 Contributing
Feel free to submit issues and enhancement requests. 
