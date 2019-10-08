const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/*
--------------LOG-------------
1. Had to downgrade firebase-tools version by -> npm install -g firebase-tools@6.8.0
   to run firebase serve
2. also made changes to firebase.json and ran serve with sudo
3.     
*/

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const express = require('express');
const app = express();

//exports.getPost = functions.https.onRequest((req, res) => {
app.get('/posts',(req, res) => {
  admin
  .firestore()
  .collection("posts")
  .orderBy('createdAt','desc')
  .get()
  .then(data => {
    let posts = [];
    data.forEach(doc => {
      posts.push({
        screamId: doc.id,
        body: doc.data().body,
        userHandle: doc.data().userHandle,
        createdAt: doc.data().createdAt
      });
      //console.log(doc.id, '=>', doc.data());
    });
    return res.json(posts);
  })
  .catch(err => {
    console.log("Error getting documents", err);
  });
});

app.post('/posts',(req, res) => {
  const newPost = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString() //admin.firestore.Timestamp.fromDate(new Date())
  };

  admin
    .firestore()
    .collection("posts")
    .add(newPost)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

// changes region to 'asia-east2' from us-central1 to deploy faster
exports.api = functions.region('asia-east2').https.onRequest(app);
