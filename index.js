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
    // await client.connect();

    const toysCollection = client.db('toyCarDB').collection('allToys');


    // const indexKeys = { name: 1};
    // const indexOptions = { name: "name" }; 
    // const result = await toysCollection.createIndex(indexKeys, indexOptions);
    // console.log(result);


    //get all toy
    app.get('/toys', async (req, res) => {
        const cursor = toysCollection.find();
        const result = await cursor.limit(20).toArray();
        res.send(result);
    })


    //get my toy ..
    app.get("/myToys", async (req, res) => {
      const  {num , email}=req.query
    
      console.log(num, email);
      if(+num === - 1 || +num === 1){
        const jobs = await toysCollection
        .find({
          sellerEmail: email

        }).sort({price : +num}).toArray();
      res.send(jobs);
      }
      else{
        const jobs = await toysCollection
        .find({
          sellerEmail:email,
        })
        .toArray();
      res.send(jobs);
      }

      });

      //get singel data
      app.get('/singelToy/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await toysCollection.findOne(query);
        res.send(result);
    })


    //get sub categoy data
    app.get('/category/:text', async (req , res )=>{
      const cat=req.params.text
      const result= await toysCollection.find({category: {$eq: cat}}).toArray()
      res.send(result)
      
    })


    //post database
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



    //update
    app.put("/updateToy/:id", async (req, res) => {
        const id = req.params.id;
        const body = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateToy= {
          $set: {
            price: body.price,
            quantity: body.quantity,    
            description: body.description,
          },
        };
        const result = await toysCollection.updateOne(filter, updateToy);
        res.send(result);
      });


      //search by name
      app.get("/searchToyName/:text", async (req, res) => {
        const text = req.params.text;
        const result = await toysCollection
          .find({
            $or: [
              { name: { $regex: text, $options: "i" } },
             
            ],
          })
          .toArray();
        res.send(result);
      });

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