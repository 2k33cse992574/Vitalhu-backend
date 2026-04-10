# VitalityHub: Core Healthcare Analytics Backend

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**Vitalhu Backend** is the analytical backbone of the VitalityHub ecosystem. It focuses on high-performance health data processing, user authentication, and serving critical vitality metrics to the ecosystem's various frontend modules.

## ✨ Core Features

- **Scalable Health Data API:** Optimized endpoints for retrieving and updating user health profile data.
- **Secure Authentication:** Implements stateless JWT authentication for high-security data access.
- **Mongoose-Driven Data Integrity:** Strict schema definitions for consistent health record management.
- **Postman Integration:** Includes a pre-configured collection (`painRelief.postman_collection.json`) for immediate API testing and validation.
- **Modular Architecture:** Cleanly separated controllers, routes, and services for easy maintenance.

## 🛠️ Tech Stack

- **Framework:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose ORM).
- **Authentication:** JWT (JSON Web Tokens).
- **Testing:** Postman Collection included.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/2k33cse992574/Vitalhu-backend.git
   cd Vitalhu-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` with your Mongo URI and secret.*

4. **Launch:**
   ```bash
   npm start
   ```

## 📝 License
This project is open-source.
