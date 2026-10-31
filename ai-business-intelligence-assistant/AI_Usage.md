# AI Usage and Project Notes

## AI Integration
The project uses Google Gemini to interpret natural-language questions and provide business insights. Sales data is stored in an SQLite database. The backend provides API endpoints to retrieve sales information.

## Validation and Safety
The application uses predefined API routes and database queries to retrieve information. The AI assistant is intended for analytics and does not perform destructive database operations.

## Problems Encountered
- Configured the SQLite database and imported the sales CSV file.
- Connected the backend API to the frontend.
- Resolved frontend access and server configuration issues.
- Configured Jest and verified the summary API using an automated test.

## Future Improvements
- Add more analytics questions and deterministic SQL queries.
- Improve error handling and input validation.
- Add more automated tests.
- Improve the user interface and display charts.
