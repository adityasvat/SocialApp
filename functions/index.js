const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

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

const firebaseConfig = {
  apiKey: "AIzaSyAS38x1Hd01c29hFDpAwH-Un9VpjIpYZ0A",
  authDomain: "socialapp-6eee5.firebaseapp.com",
  databaseURL: "https://socialapp-6eee5.firebaseio.com",
  projectId: "socialapp-6eee5",
  storageBucket: "socialapp-6eee5.appspot.com",
  messagingSenderId: "808144554883",
  appId: "1:808144554883:web:1d875ad0d7469e208ac4b6",
  measurementId: "G-B7KFQE8Y72"
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

//exports.getPost = functions.https.onRequest((req, res) => {
app.get("/posts", (req, res) => {
  db.collection("posts")
    .orderBy("createdAt", "desc")
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

app.post("/posts", (req, res) => {
  const newPost = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString() //admin.firestore.Timestamp.fromDate(new Date())
  };

  db.collection("posts")
    .add(newPost)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

//Signup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  // TODO: validate data
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(Idtoken => {
      token=Idtoken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })  
    .then(()=>{  
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      //email-already-in-use is not 500:Internal Server Error but 400:Bad Request
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
  /*  
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      return res
        .status(201)
        .json({ message: `user ${data.user.uid} signed up successfully` });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
  */
});

// changes region to 'asia-east2' from 'us-central1' to deploy faster
exports.api = functions.region("asia-east2").https.onRequest(app);
