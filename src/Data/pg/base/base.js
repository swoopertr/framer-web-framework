const { Client } = require('pg');

// Connection configuration
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'brotion',
  password: '1234',
  port: 5432,
});

// Connect to the database
client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

// Function to execute a parameterized query
async function executeQuery(query, params) {
  try {
    const res = await client.query(query, params);
    return res.rows; // Returns the rows from the query result
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
}

// Main function to use the executeQuery function
async function main() {
  try {
    // Example: Query with parameters
    const query = 'SELECT * FROM users WHERE age > $1 AND status = $2';
    const params = [25, 'active']; // $1 = 25, $2 = 'active'

    const rows = await executeQuery(query, params);
    console.log('Query result:', rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end(); // Close the database connection
  }
}

main();

module.exports = executeQuery