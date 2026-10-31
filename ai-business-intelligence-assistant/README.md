# AI Business Intelligence Assistant

## Overview
An AI-powered business intelligence application that helps users explore sales data using natural-language questions.

## Technologies
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: SQLite
- AI: Google Gemini API
- Dataset: CSV sales records

## Features
- Import sales records from CSV into SQLite
- View sales summary through REST APIs
- Ask business questions using a web interface
- Receive AI-generated answers using Gemini

## Verified Result
SQLite calculation shows that Accessories has the highest completed sales, totaling 533,100.

## Run the Project
1. Open the backend folder.
2. Install dependencies using `npm install`.
3. Configure `GEMINI_API_KEY` in the backend `.env` file.
4. Start the server using `node server.js`.
5. Open `http://localhost:5000/index.html`.

## Security
The Gemini API key is stored in `.env` and should not be shared or committed to Git.
