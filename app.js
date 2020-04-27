const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

const homeStartingContent = "This blog was made to log your thoughts, ideas or your diary, so feel free to hit the Compose section to express yourself.";
// const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
// const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

/*------------------------------ Database ------------------------------------*/
//Database - Connection:
const databaseUrl = "mongodb+srv://admin-amin:admin123@cluster0-nj7ug.mongodb.net/";
mongoose.connect(databaseUrl + "blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


//Database - Schema creation:
const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Post title is missed."],
    minlength: 3,
    maxlenght: 30
  },
  content: {
    type: String,
    required: [true, "Post body is missed."],
    minlength: 5,
    maxlenght: 1000
  }
});

//Database - Collection creation:
const Post = mongoose.model("Post", postsSchema);

/*------------------------------ Home-page -----------------------------------*/
// Route handler:
app.get("/", function(req, res) {

  Post.find({}, function(err, data){
    if (!err) {

      res.render("home.ejs", {
        p1: homeStartingContent,
        allPosts: data
      });
    }
  });
});

/*------------------------------ About-page ----------------------------------*/
// Route handler:
// app.get("/about", function(req, res) {
//
//   res.render("about.ejs", {
//     p1: aboutContent
//   });
// });

/*------------------------------ Contact-page --------------------------------*/
// Route handler:
// app.get("/contact", function(req, res) {
//
//   res.render("contact.ejs", {
//     p1: contactContent
//   });
// });

/*------------------------------ Compose-page --------------------------------*/
// Route handler:
app.get("/compose", function(req, res) {

  res.render("compose.ejs", {  /////////////
  });
});

//POSTed data handler:
app.post("/compose", function(req, res) {

  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  //Database - Document creation:
  const postDocument = new Post({
    title: post.title,
    content: post.content
  });
  postDocument.save(function(err) {
    res.redirect("/");
  });

});

/*------------------------------ Posts-page ----------------------------------*/
// Route handler:
app.get("/posts/:id", function(req, res) {

  const postId = req.params.id;

  Post.findOne({_id: postId}, function(err, data) {

    if (err) {

      res.render("post.ejs", {
        postTitle: "!",
        postContent: "Post Not Found!"
      });
    } else {
      res.render("post.ejs", {
        postTitle: data.title,
        postContent: data.content
      });
    }
  });
});

app.post("/delete", function(req, res) {

  const removedPost = req.body.delete;

  Post.deleteOne({title: removedPost}, function(err) {
    res.redirect("/");
  });
});

/*------------------------------ Launch the Server ---------------------------*/

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};

app.listen(port, function() {
  console.log("Server has started successfully");
});
