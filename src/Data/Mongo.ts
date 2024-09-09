const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://riccardorossimori:Riccardo15021995@camgeosearch.eggzu.mongodb.net/?retryWrites=true&w=majority&appName=CAMGeoSearch";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

export {};
//TODO: Aggiungi login per l'università/Admin
//TODO: Aggiungi caricamento file CVS per il caricamento di nuove aziende
//TODO: Converti le posizioni delle aziende in coordinate geografiche
//TODO: Converti il file CVS in un file JSON
//TODO: Chiedi al prof se sia il caso di aggiungere un campo per il corso di cui fa parte lo studente
//TODO: Visualizza le aziende sulla mappa
//TODO: Implementa l'effettiva ricerca delle aziende
//TODO: Aggiungi la possibilità di filtrare le aziende 
