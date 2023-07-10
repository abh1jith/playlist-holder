const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://127.0.0.1:27017/playlist");

const songSchema = mongoose.Schema({
    title: String,
    link: String,
    platform: String,
    user: String
});

const songs = mongoose.model("song", songSchema);

app.post("/add", function(req, res){
    let newSong = new songs({
        "title": req.body.title,
        "link": req.body.link,
        "platform": req.body.platform,
        "user": req.body.user
    })

    newSong.save().then((err) => console.log(err));

    res.redirect("/");
});

app.post("/remove", function(req, res){
    console.log(req.body.removeTitle);
    songs.findOneAndDelete({ title: req.body.removeTitle })
        .then(deletedSong => {
            if (deletedSong) {
            console.log("Song deleted:", deletedSong);
            } else {
            console.log("Song not found.");
            }
        })
        .catch(err => {
            console.error(err);
        });
    
    res.redirect("/");
    
})

app.get("/", function(req, res){
    // Getting the stuff from the database
    songs.find({})
        .then(songs => {
        console.log(songs);
        // Sending the stuff to the frontend
        res.render("index", {songsList: songs});
    })
        .catch(err => {
        console.error(err);
    });

    
});

app.listen(3000, function(err){
    if(err){
        throw(err);
    }
    console.log("Server has started on port: 3000");
});