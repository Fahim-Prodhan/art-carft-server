const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djweinm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("artCraftDB");
    const craftCollections = database.collection("crafts");
    const subcategoryCollections = database.collection("subcategory");

    // get all the crafts
    app.get("/crafts", async (req, res) => {
      const allCrafts = craftCollections.find();
      const result = await allCrafts.toArray();
      res.send(result);
    });

    // get all the subcategories
    app.get("/subcategories", async (req, res) => {
      const allSubcategories = subcategoryCollections.find();
      const result = await allSubcategories.toArray();
      res.send(result);
    });

    // get all the craft of a user added
    app.get("/crafts/:user_email", async (req, res) => {
      const email = req.params.user_email;
      const query = { user_email: email };
      const usersCrafts = craftCollections.find(query);
      const result = await usersCrafts.toArray();
      res.send(result);
    });

    // get the details of a particular craft
    app.get("/crafts/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollections.findOne(query);
      res.send(result);
    });

    // Add craft
    app.post("/addCrafts", async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollections.insertOne(newCraft);
      res.send(result);
    });

    // Filter according to customization
    app.get("/crafts/filter/:value/:email", async (req, res) => {
      const value = req.params.value;
      const email = req.params.email;
      const query = { customization: value, user_email:email };
      // console.log(query);
      const filteredCraft = craftCollections.find(query);
      const result = await filteredCraft.toArray();
      res.send(result);
    });

    // Filter and Get the craft according to subcategory
    app.get("/crafts/subcategory/filter/:value", async (req, res) => {
      const value = req.params.value;
      const query = { subcategory_name: value };
      const filteredCraft = craftCollections.find(query);
      const result = await filteredCraft.toArray();
      res.send(result);
    });

    // delete a craft
    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollections.deleteOne(query);
      res.send(result);
    });

    app.put("/crafts/update/:id", async (req, res) => {
      const id = req.params.id;
      const craft = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateCraft = {
        $set: {
          image: craft.image,
          item_name: craft.item_name,
          subcategory_name: craft.subcategory_name,
          short_description: craft.short_description,
          price: craft.price,
          rating: craft.rating,
          stock_status: craft.stock_status,
          processing_time: craft.processing_time,
          customization: craft.customization
        },
      };

      const result = await craftCollections.updateOne(filter, updateCraft, options);
      res.send(result);


    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
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
