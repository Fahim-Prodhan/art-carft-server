const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djweinm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const database = client.db("artCraftDB");
    const craftCollections = database.collection("crafts");

    app.get('/crafts',async(req,res)=>{
        const allCrafts = craftCollections.find();
        const result = await allCrafts.toArray();
        res.send(result)
    })

    app.get("/crafts/:user_email", async (req, res) => {
        const email = req.params.user_email;
        const query = { user_email: email };
        const usersCrafts =  craftCollections.find(query);
        const result = await usersCrafts.toArray();
        res.send(result);
      });

    app.post('/addCrafts',async (req,res)=>{
        const newCraft = req.body
        console.log(newCraft);
        const result = await craftCollections.insertOne(newCraft)
        res.send(result)
    })
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Testing the Server");
});

app.listen(port, () => {
  console.log("Running on", port);
});