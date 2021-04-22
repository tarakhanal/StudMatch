
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const { MongoClient } = require('mongodb')
let ObjectId = require('mongodb').ObjectID

const uri =
  "mongodb://127.0.0.1:27017";
// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true });

const app = express()

const server = require("http").createServer(app)

app.use(express.json({limit: '50mb'}))
app.use(cors())
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}))
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
app.use(express.static(path.join(__dirname, 'public')))

const port = 4000
app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})

app.post('/api/createAccount', async (req, res) => {
  try {
    await client.connect()
    const database = client.db();
    const users = database.collection("users");
    const profiles = database.collection("profiles");
    // create a document to be inserted
    const user = {
      email: req.body.email,
      password: req.body.password,
      dateCreated: `${new Date()}`,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      major: req.body.major,
      school: req.body.school,
      skills: req.body.skills,
      interests: req.body.interests,
      profilePicture: req.body.profilePicture,
      aboutMe: req.body.aboutMe,
      userArrayIndex: 0,
      likedProfiles: [],
      matches: [],
      messageHistory: []
    };

    const result = await users.insertOne(user);

    await profiles.insertOne({"userProfile": `${result.insertedId}`});

    // console.log(user)
    console.log(
      `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
    );
  } finally {
    await client.close();
  }

  res.status(200).end()
})

app.post('/api/getNextUser', async (req, res) => {
  let nextUserProfile = await getNextUser(req.body.userId)
  console.log('Get next user: ', nextUserProfile)
  res.send(nextUserProfile).end()
})

app.post('/api/userDecision', async (req, res) => {
  //Document user decision
  const userDecision = req.body.decision;
  await client.connect();
  const database = client.db();
  const users = database.collection("users");

  if (userDecision) {
    await users.updateOne({_id: ObjectId(`${req.body.loggedInUserId}`)}, {"$push": {"likedProfiles": `${req.body.ratedUserId}`}});
    const likedProfiles = await users.find({_id: ObjectId(`${req.body.ratedUserId}`)}).likedProfiles;
    likedProfiles.forEach(async (user) => {
      if(user == req.body.loggedInUserId) {
        // it's a match!
        await users.updateOne({_id: ObjectId(`${req.body.loggedInUserId}`)}, {"$push": {"matches": `${req.body.ratedUserId}`}});
        await users.updateOne({_id: ObjectId(`${req.body.ratedUserId}`)}, {"$push": {"matches": `${req.body.loggedInUserId}`}});
      }
    })
  }

  let nextUser = getNextUser();
  res.send(nextUser).end()
})

const getNextUser = async (userId) => {
  //get the next user
  try {
  await client.connect()
  const database = client.db();
  const users = database.collection("users");
  const profiles = database.collection("profiles");
  // let i = await users.find({"_id": `${userId}`}).userArrayIndex;
  let i = await users.findOne({_id: ObjectId(`${userId}`)});
  console.log('Index object value: ', i.userArrayIndex)
  const userProfileId = await profiles.find()[i.userArrayIndex].userProfile;
  const userProfile = await users.findOne({"_id": `${userProfileId}`});
  await users.updateOne({"_id": `${userId}`}, {"$set": {"userArrayIndex": `${i.userArrayIndex + 1}`}});
  // console.log("User's profile: ", userProfile);
  return userProfile;

  } finally {
    // await client.close();
  }
}

app.post('/api/sendMessage', async (req, res) => {
  let loggedInUserId = req.body.loggedInUserId
  let actionUserId = req.body.actionUserId
  let message = req.body.message
  let formattedMessage = {
    sentBy: loggedInUserId,
    receivedBy: actionUserId,
    timeSent: `${new Date()}`,
    message
  }
  try {
    await client.connect()
    const database = client.db()
    const users = database.collection("users")
    // db.posts.update({_id: <post id>}, {$push: {comments: {comment: 'hello...', user: user}});
    await users.updateOne({_id: ObjectId(`${loggedInUserId}`)},
    {
      "$push": {
        "messageHistory": formattedMessage
      }
    },
    { upsert: true }
    )
  } finally {
    // await client.close()
  }
  console.log('insert complete, responding')
  res.status(200).end()
})

app.post('/api/messageStream', async (req, res) => {
  try {
    await client.connect()
    const database = client.db()
    const users = database.collection("users")
    const pipeline = [ { "$match": { "matchHistory": { $lt: 15 } } } ]
    const changeStream = collection.watch(pipeline);
  } catch {
    res.status(400).end()
  } finally {
    res.status(200).end()
  }
})

app.post('/api/login', async (req, res) => {
  try {
    await client.connect()
    const database = client.db();
    const users = database.collection("users");
    const query = { email: req.body.email, password: req.body.password };

    const options = {
      sort: { email: 1 },
      projection: {
        email: 1,
        password: 1,
        dateCreated: 1,
        firstName: 1,
        lastName: 1,
        major: 1,
        school: 1,
        skills: 1,
        interests: 1,
        profilePicture: 1,
        aboutMe: 1,
        _id: 1,
        messageHistory: 1
      },
    };
    console.log(users.find())
    const cursor = users.find(query, options);
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
      res.status(400).end()
    }
    let userData = {}
    // replace console.dir with callback to access individual elements
    await cursor.forEach((doc) => userData = doc);
    console.log(userData)
    res.send(userData).end()
  } finally {
    // await client.close();
  }
  res.status(200).end()
})

const io = require('socket.io')(server, {
  cors: { origin: "*" }
})

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('message', (message) => {
    console.log(message)
    io.emit('message', message)
  })
})

server.listen(4001, () => {
  console.log('websocket server is running on port 4001')
})