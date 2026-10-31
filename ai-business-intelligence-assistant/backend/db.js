const sqlite3 = require("sqlite3").verbose();
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

// Database and CSV file paths
const dbPath = path.join(__dirname, "sales.db");
const csvPath = path.join(__dirname, "../data/sales.csv");

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create sales table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      transaction_id TEXT PRIMARY KEY,
      order_date TEXT,
      product TEXT,
      category TEXT,
      region TEXT,
      sales_channel TEXT,
      quantity INTEGER,
      unit_price REAL,
      discount_amount REAL,
      status TEXT
    )
  `);

  // Check whether data is already imported
  db.get("SELECT COUNT(*) AS count FROM sales", (err, row) => {
    if (err) {
      console.error("Could not check sales table:", err.message);
      return;
    }

    if (row.count > 0) {
      console.log(`Sales table already contains ${row.count} records.`);
      return;
    }

    // Check whether CSV exists
    if (!fs.existsSync(csvPath)) {
      console.error("CSV file not found:", csvPath);
      return;
    }

    const insert = db.prepare(`
      INSERT INTO sales (
        transaction_id,
        order_date,
        product,
        category,
        region,
        sales_channel,
        quantity,
        unit_price,
        discount_amount,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let imported = 0;

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (record) => {
        insert.run(
          record.Transaction_Id,
          record.Order_date,
          record.Product,
          record.Category,
          record.Region,
          record.Sales_channel,
          Number(record.Quantity) || 0,
          Number(record.Unit_price) || 0,
          Number(record.Discount_amount) || 0,
          record.Status,
          (err) => {
            if (err) {
              console.error("Error inserting record:", err.message);
            } else {
              imported++;
            }
          }
        );
      })
      .on("end", () => {
        insert.finalize((err) => {
          if (err) {
            console.error("Import finalization failed:", err.message);
          } else {
            console.log(`CSV import completed. Records imported: ${imported}`);
          }
        });
      })
      .on("error", (err) => {
        console.error("CSV reading failed:", err.message);
      });
  });
});

// Export database connection
module.exports = db;
