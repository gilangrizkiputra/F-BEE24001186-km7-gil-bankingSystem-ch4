# Banking System

This project is a simple banking system created as part of Chapter 4 and  5 assignment for the F-BEE24001186 KM7 module. It demonstrates basic banking operations like creating accounts, deposits, withdrawals, and balance checks.

## Prerequisites

Before using this project, make sure you have the following software installed on your machine:

1. **Node.js**: You can download and install it from [here](https://nodejs.org/).
2. **PostgreSQL**: Download and install PostgreSQL from [here](https://www.postgresql.org/download/).

After installing PostgreSQL, ensure that the PostgreSQL service is running and you have a database set up for this project.

## Installation

To run this project locally, follow the steps below:

1. Clone this repository:
   ```bash
   git clone https://github.com/gilangrizkiputra/F-BEE24001186-km7-gil-bankingSystem-ch4.git
   
2. Navigation to the project directory:
   ```bash
   cd F-BEE24001186-km7-gil-bankingSystem-ch4
   
3. Rename .env.sample to .env and configure it as follows:
   ```bash
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>?schema=public
   PORT=your-local-port
   JWT-TOKEN=your-secret-key
   
5. Install the necessary dependencies:
   ```bash
   npm install
   
6. Run Project
   ```bash
   npm start

## Test Project
- Run the test:
  ```bash
  npm test

## API - Docs
1. Run the project:
   ```docs
   npm start
3. open a browser and enter the following link:
   ```docs
   http://localhost:<your-port>/api-docs/

