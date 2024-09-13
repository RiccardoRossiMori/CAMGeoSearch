const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const uri = "mongodb+srv://riccardorossimori:Riccardo15021995@camgeosearch.eggzu.mongodb.net/?retryWrites=true&w=majority&appName=CAMGeoSearch";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        //console.log("MongoDB connected");

        // Define routes
        app.get('/api/companies', async (req, res) => {
            try {
                const database = client.db("CAMGeoSearch");
                const collection = database.collection("Aziende");

                // Execute the query
                const companies = await collection.find({}).toArray();
               // console.log('Executed query:', JSON.stringify({ find: "Aziende", filter: {} }));
               // console.log('Companies:', companies);
                res.json(companies);
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

run().catch(console.dir);