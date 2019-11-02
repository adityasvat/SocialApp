/*--------------------------------------LOG-----------------------------------------
1. Had to downgrade firebase-tools version by -> npm install -g firebase-tools@6.8.0
   to run firebase serve
2. also made changes to firebase.json and ran serve with sudo
3.     
-----------------------------------------------------------------------------------*/

const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/FBAuth");
const {
  getAllPosts,
  postOnePost,
  getPost,
  commentOnPost,
  likePost,
  unlikePost,
  deletePost
} = require("./handlers/posts");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/users");

//post routes
app.get("/posts", getAllPosts);
app.post("/posts", FBAuth, postOnePost);
app.get("/posts/:postId", getPost); //: is a route parameter to access value without anyone logged in
app.delete('/posts/:postId', FBAuth, deletePost);
app.get('/posts/:postId/like', FBAuth, likePost);
app.get('/posts/:postId/unlike', FBAuth, unlikePost);
app.post("/posts/:postId/comment", FBAuth, commentOnPost);

//user routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

// changes region to 'asia-east2' from 'us-central1' to deploy faster
exports.api = functions.region("asia-east2").https.onRequest(app);