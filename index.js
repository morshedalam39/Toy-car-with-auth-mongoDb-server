const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bthwvgc.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toysCollection = client.db('toyCarDB').collection('allToys');


    app.get('/toys', async (req, res) => {
        const cursor = toysCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    app.get("/myToys/:email", async (req, res) => {
        console.log(req.params.id);
        const jobs = await toysCollection
          .find({
            sellerEmail: req.params.email,
          })
          .toArray();
        res.send(jobs);
      });


    app.post('/toys', async (req, res) => {
        const toys = req.body;
        console.log(toys);
        const result = await toysCollection.insertOne(toys);
        res.send(result);
    });

    // deleteOne

    app.delete('/myToy/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await toysCollection.deleteOne(query);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Toy Car is running')
})

app.listen(port, () => {
    console.log(`Toy Car Server is running on port ${port}`)
})