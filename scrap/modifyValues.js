const mysql = require('mysql2/promise');

// Environment Variables (Replace with your details)
const DB_HOST = process.env.NEXT_PUBLIC_DB_HOST || 'retirementcoin.io';
const DB_USER = process.env.NEXT_PUBLIC_DB_USER || 'retimtrc_1';
const DB_PASSWORD = process.env.NEXT_PUBLIC_DB_PASSWORD || '12345aaaaa@aaaabbBbb!!';
const DB_NAME = process.env.NEXT_PUBLIC_DB_NAME || 'retimtrc_data';

// Async Function to Modify Values
const modifyDatabaseValues = async () => {
    try {
        // Create MySQL Connection
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
        });

        console.log('✅ Connected to the database.');

        // Example: Modify values in your table
        const newHoldersValue = 12345; // Replace with the new value
        const query = `
            DELETE FROM data; -- Clears existing data
            INSERT INTO data (holders) VALUES (?); -- Inserts the new value
        `;

        await connection.query(query, [newHoldersValue]);

        console.log(`✅ Database updated: holders = ${newHoldersValue}`);
        await connection.end();
    } catch (error) {
        console.error('❌ Error modifying database values:', error.message);
    }
};

// Run the function
modifyDatabaseValues();