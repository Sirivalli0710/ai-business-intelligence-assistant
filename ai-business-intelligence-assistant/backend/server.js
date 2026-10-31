require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const cors = require("cors");

const express = require("express");
const db = require("./db");

const app = express();
app.use(express.static("../"));
app.use(cors());
app.use(express.json());
const PORT = 5000;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "AI Business Intelligence Assistant Backend is Running!"
    });
});

// Get all sales records
app.get("/api/sales", (req, res) => {
    db.all("SELECT * FROM sales", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            totalRecords: rows.length,
            sales: rows
        });
    });
});

// Get sales summary
app.get("/api/summary", (req, res) => {
    const query = `
        SELECT
            COUNT(*) AS totalTransactions,
            SUM(Quantity) AS totalQuantity,
            SUM(Quantity * Unit_price - Discount_amount) AS totalSales
        FROM sales
        WHERE Status = 'Completed'
    `;

    db.get(query, [], (err, row) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(row);
    });
});

// Get sales grouped by category
app.get("/api/sales-by-category", (req, res) => {
    const query = `
        SELECT
            Category,
            SUM(Quantity * Unit_price - Discount_amount) AS totalSales,
            SUM(Quantity) AS totalQuantity
        FROM sales
        WHERE Status = 'Completed'
        GROUP BY Category
        ORDER BY totalSales DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// Get sales grouped by region
app.get("/api/sales-by-region", (req, res) => {
    const query = `
        SELECT
            Region,
            SUM(Quantity * Unit_price - Discount_amount) AS totalSales,
            SUM(Quantity) AS totalQuantity
        FROM sales
        WHERE Status = 'Completed'
        GROUP BY Region
        ORDER BY totalSales DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});
// Get sales grouped by sales channel
app.get("/api/sales-by-channel", (req, res) => {
    const query = `
        SELECT
            Sales_channel,
            SUM(Quantity * Unit_price - Discount_amount) AS totalSales,
            SUM(Quantity) AS totalQuantity
        FROM sales
        WHERE Status = 'Completed'
        GROUP BY Sales_channel
        ORDER BY totalSales DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// Get sales grouped by product
app.get("/api/sales-by-product", (req, res) => {
    const query = `
        SELECT
            Product,
            SUM(Quantity * Unit_price - Discount_amount) AS totalSales,
            SUM(Quantity) AS totalQuantity
        FROM sales
        WHERE Status = 'Completed'
        GROUP BY Product
        ORDER BY totalSales DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// Get transaction counts by status
app.get("/api/sales-by-status", (req, res) => {
    const query = `
        SELECT
            Status,
            COUNT(*) AS totalTransactions
        FROM sales
        GROUP BY Status
        ORDER BY totalTransactions DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// Get sales grouped by order date
app.get("/api/sales-by-date", (req, res) => {
    const query = `
        SELECT
            Order_date,
            SUM(Quantity * Unit_price - Discount_amount) AS totalSales,
            COUNT(*) AS totalTransactions
        FROM sales
        WHERE Status = 'Completed'
        GROUP BY Order_date
        ORDER BY Order_date ASC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// Filter sales by region
app.get("/api/filter-by-region", (req, res) => {
    const region = req.query.region;

    if (!region) {
        return res.status(400).json({
            error: "Please provide a region"
        });
    }

    const query = `
        SELECT *
        FROM sales
        WHERE Region = ?
    `;

    db.all(query, [region], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            region: region,
            totalRecords: rows.length,
            sales: rows
        });
    });
});
// Filter sales by category
app.get("/api/filter-by-category", (req, res) => {
    const category = req.query.category;

    if (!category) {
        return res.status(400).json({
            error: "Please provide a category"
        });
    }

    const query = `
        SELECT *
        FROM sales
        WHERE Category = ?
    `;

    db.all(query, [category], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            category: category,
            totalRecords: rows.length,
            sales: rows
        });
    });
});

// Filter sales by sales channel
app.get("/api/filter-by-channel", (req, res) => {
    const channel = req.query.channel;

    if (!channel) {
        return res.status(400).json({
            error: "Please provide a sales channel"
        });
    }

    const query = `
        SELECT *
        FROM sales
        WHERE Sales_channel = ?
    `;

    db.all(query, [channel], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            channel: channel,
            totalRecords: rows.length,
            sales: rows
        });
    });
});

// Filter sales by transaction status
app.get("/api/filter-by-status", (req, res) => {
    const status = req.query.status;

    if (!status) {
        return res.status(400).json({
            error: "Please provide a transaction status"
        });
    }

    const query = `
        SELECT *
        FROM sales
        WHERE Status = ?
    `;

    db.all(query, [status], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            status: status,
            totalRecords: rows.length,
            sales: rows
        });
    });
});
// Flexible analytics API
app.get("/api/analytics", (req, res) => {
    const { region, category, channel, status } = req.query;

    let query = `
        SELECT
            COUNT(*) AS totalTransactions,
            SUM(Quantity) AS totalQuantity,
            SUM(Quantity * Unit_price - Discount_amount) AS totalSales
        FROM sales
        WHERE 1 = 1
    `;

    const params = [];

    if (region) {
        query += " AND Region = ?";
        params.push(region);
    }

    if (category) {
        query += " AND Category = ?";
        params.push(category);
    }

    if (channel) {
        query += " AND Sales_channel = ?";
        params.push(channel);
    }

    if (status) {
        query += " AND Status = ?";
        params.push(status);
    }

    db.get(query, params, (err, row) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            filters: { region, category, channel, status },
            summary: row
        });
    });
});

// Gemini-powered question-answering API
app.get("/api/ask", async (req, res) => {
    const question = req.query.question;

    if (!question || question.trim() === "") {
        return res.status(400).json({
            error: "Please provide a valid question"
        });
    }

    if (question.length > 500) {
        return res.status(400).json({
            error: "Question is too long. Maximum length is 500 characters."
        });
    }

    // Fetch the sales data from SQLite
    db.all("SELECT * FROM sales", [], async (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: "Unable to retrieve sales data"
            });
        }

        try {
            const prompt = `
You are an AI Business Intelligence Assistant.

Answer the user's question using only the sales dataset provided.
The dataset is JSON. Do not invent numbers.
If the answer cannot be found, say so.
Keep the answer clear and concise.

Sales dataset:
${JSON.stringify(rows)}

User question:
${question}
`;

            const response = await ai.models.generateContent({
               model: "gemini-2.5-flash",
                contents: prompt
            });

            res.json({
                question: question,
                answer: response.text
            });
        } catch (error) {
            console.error("Gemini error:", error.message);

            res.status(500).json({
                error: "Gemini could not process the question"
            });
        }
    });
});
// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// General error handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        error: "Internal server error"
    });
});
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
