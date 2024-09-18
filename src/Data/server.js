const express = require('express');
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const uri = "mongodb+srv://riccardorossimori:Riccardo15021995@camgeosearch.eggzu.mongodb.net/?retryWrites=true&w=majority&appName=CAMGeoSearch";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function run() {
    try {
        await client.connect();

        app.post('/api/geoquery', async (req, res) => {

            const database = client.db("CAMGeoSearch");
            const collection = database.collection("Aziende");
            const {center, radius, sector} = req.body;
            const [lon, lat] = center;
            try {
                const query = {
                    location: {
                        $geoWithin: {
                            $centerSphere: [[lon, lat], radius / 8500000]
                        }
                    },
                    "properties.Settore": {
                        $regex: sector || "",
                        $options: "i"
                    }
                };
                const result = await collection.find(query).toArray();
                res.json(result);
            } catch (error) {
                console.error('Error executing geoquery:', error);
                res.status(500).send('Internal Server Error');
            }
        });


        // Define routes
        app.get('/api/companies', async (req, res) => {
            try {
                const database = client.db("CAMGeoSearch");
                const collection = database.collection("Aziende");
                const companies = await collection.find({}).toArray();
                res.json(companies);
            } catch (err) {
                res.status(500).json({message: err.message});
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