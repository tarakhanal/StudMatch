
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
      messageHistory: {}
    };

    const result = await users.insertOne(user);

    await profiles.insertOne({"userProfile": `${result.insertedId}`});

    console.log(user)
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
  res.send(nextUserProfile)
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
  //return match status and next user profile
  // console.log(req.body.loggedInUserId, req.body.ratedUserId, req.body.decision)
})

const getNextUser = async (userId) => {
  //get the next user
  try {
  await client.connect()
  const database = client.db();
  const users = database.collection("users");
  const profiles = database.collection("profiles");
  // let i = await users.find({"_id": ${userId}}).userArrayIndex;
  let i = await users.findOne({_id: ObjectId(`${userId}`)});
  console.log('Index object value: ', i.userArrayIndex)
  const profile = await profiles.find();
  const userProfileId = profile[i.userArrayIndex].userProfile;
  const userProfile = await users.findOne({"_id": `${userProfileId}`});
  await users.updateOne({"_id": `${userId}`}, {"$set": {"userArrayIndex": `${i.userArrayIndex + 1}`}});
  // console.log("User's profile: ", userProfile);
  return i;

  } finally {
    // await client.close();
  }
}

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
        _id: 1
      },
    };
    const cursor = users.find(query, options);
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
      res.status(400).end()
    }
    let userData = {}
    // replace console.dir with callback to access individual elements
    await cursor.forEach((doc) => userData = doc);
    res.send(userData)
    console.log(userData)
  } finally {
    // await client.close();
  }
  res.status(200).end()
})

// app.post('/api/login/more-info', async (req, res) => {
//   try {
//       const user = {
//       firstName: "Tara",
//       lastName: "Khanal",
//       email: "tara@test.com",
//       password: "pwd123",
//       major: "Computer Sciecne",
//       school: "The University of Akron",
//       skills: [ "Hiking", "Video Games", "Painting", "Snowboarding", "Basketball" ],
//       profilePicture: "https://via.placeholder.com/150",
//       aboutMe: "My name is Tara"
//       };

//       await client.connect();

//       const database = client.db("test");
//       const users = database.collection("users");

//       const result = await users.insertOne(user);

//       console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);
//       console.log("User info is successfully stored!");
//       } finally {
//       await client.close();
//   }
// });

// app.get("/userInfo", async (req, res) => {

//   try{
//       await client.connect();
//       const database = client.db("test");
//       const users = database.collection("users");
//       const cursor = users.find();
  
//       // prints each field in the console
//       cursor.forEach((doc, err) =>{
//           console.log(doc);
//       });
//       res.send(`Your info: ${cursor}`);

//   } finally {
//       await client.close();
//   }
// });
