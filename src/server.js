
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const { MongoClient } = require('mongodb')

const uri =
  "mongodb://127.0.0.1:27017";
// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // await client.close();
  }
}

const app = express()

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
  run()
})

app.post('/api/createAccount', async (req, res) => {
  try {
    const database = client.db();
    const users = database.collection("users");
    // create a document to be inserted
    const doc = { email: req.body.email, password: req.body.password, dateCreated: `${new Date()}` };
    const result = await users.insertOne(doc);
    console.log(
      `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
    );
  } finally {
    // await client.close();
  }

  res.status(200).end()
})

app.post('/api/login', async (req, res) => {
  try {
    const database = client.db();
    const movies = database.collection("users");
    const query = { email: req.body.email, password: req.body.password };

    const options = {
      // sort returned documents in ascending order by title (A->Z)
      sort: { email: 1 },
      projection: { email: 1, password: 1, dateCreated: 1 },
    };
    const cursor = movies.find(query, options);
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
      res.status(400).end()
    }
    // replace console.dir with callback to access individual elements
    await cursor.forEach(console.dir);
  } finally {
    // await client.close();
  }
  res.status(200).end()
})
