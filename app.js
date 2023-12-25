// require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb+srv://abhijithdameruppala:abhimani12@cluster0.wthch8f.mongodb.net/playlist")
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));


const songSchema = mongoose.Schema({
    songID: {
      type: Number,
      autopopulate: true
    },
    title: String,
    link: String,
    platform: String
});
const songs = mongoose.model("song", songSchema);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  playlist:{
    type: [songSchema]
  }
});
const users = mongoose.model("User", userSchema);


app.post("/register", function(req, res){
  try{
    bcrypt.hash(req.body.password, 10, function(err, hash){
        let newUser = new users({ 
          name: req.body.name,
          email: req.body.email, 
          password: hash,
          playlist:[] });
        newUser.save().then((err) => console.log(err));
        res.redirect("/login");
    })
  }
  catch(err){
    console.log(err);
  }
});


app.get("/register", function(req, res){
  res.render("register");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", function(req, res){
  
  users.findOne({ email: req.body.email })
        .then(user => {
            //if user not exist than return status 400
            if (!user){
              console.log("There is no account found in the database, please create one here!")  
              res.render("register");
            }
            //if user exist than compare password
            //password comes from the user
            //user.password comes from the database
            else{
            bcrypt.compare(req.body.password, user.password, (err, data) => {
                //if error than throw error
                if (err) throw err
                //if both match than you can do anything
                if (data) {
                    // res.render("/")
                  res.render("index", { songsList: user.playlist, email: user.email });

                } else {
                    console.log("Wrong Password, Try again!");
                    res.render("login");
                }

            })
          }
        })
});


app.post("/add", function(req, res){
    let newSong = new songs({
        "title": req.body.title,
        "link": req.body.link,
        "platform": req.body.platform,
    })
    const useremail = req.body.useremail;
    console.log(useremail + "CODE");
    newSong.save()
    .then(savedSong => {
        console.log(useremail);

        return users.findOneAndUpdate(
            { email: useremail },
            { $push: { playlist: savedSong } },
            { new: true }
        );
    })
    .then(updatedUser => {
        if (updatedUser) {
            res.render("index", { songsList: updatedUser.playlist, email: updatedUser.email });
        } else {
            // User not found
            console.log(useremail);
            res.status(404).send("User not found");
        }    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Error updating the playlist.');
    });
});

app.post("/remove", function(req, res){
    const useremail = req.body.useremail;
    const removeTitle = req.body.removeTitle;
    users.findOne({ email: useremail })
        .then(user => {
            // Filter out the song to be deleted
            user.playlist = user.playlist.filter(song => song.title !== removeTitle);
            // Save the updated user document
            return user.save();
        })
    users.findOne({email: useremail})
        .then((updatedUser) => {
            res.render("index", { songsList: updatedUser.playlist, email: updatedUser.email });
        })
})

app.get("/", function(req, res){
    res.redirect("/login");

});

app.listen(process.env.PORT || 3000, function(err){
    if(err){
        throw(err);
    }
    console.log("Server has started");
});