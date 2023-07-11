const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const mongoose = require("mongoose");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

// mongoose.connect("mongodb://127.0.0.1:27017/playlist");
mongoose.connect("mongodb+srv://abhijithdameruppala:abhimani12@cluster0.wthch8f.mongodb.net/playlist")

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
//         const url = "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=racist,sexist&type=twopart";
//         try{
//             https.get(url, function(response){
//         response.on("data", function(data){
//             const jokeData = JSON.parse(data);
//             console.log(jokeData.setup, jokeData.delivery);
//             res.render("index", {songsList: songs, setup: jokeData.setup, delivery: jokeData.delivery});
//         });
//     });
// }   catch{
//     res.render("index", {songsList: songs, setup: "Joke cannot be loaded at this time", delivery: "Please reload / try again later"});
// }
//         // Sending the stuff to the frontend
//     })
//         .catch(err => {
//         console.error(err);
//     });
    
    const url = "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=racist,sexist&type=twopart";

try {
  https.get(url, function(response) {
    let responseData = "";

    response.on("data", function(data) {
      responseData += data;
    });

    response.on("end", function() {
      try {
        const jokeData = JSON.parse(responseData);
        console.log(jokeData.setup, jokeData.delivery);
        res.render("index", { songsList: songs, setup: jokeData.setup, delivery: jokeData.delivery });
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        res.render("index", { songsList: songs, setup: "Joke cannot be loaded at this time", delivery: "Please reload / try again later" });
      }
    });
  });
} catch (error) {
  console.error("Error in API request:", error);
  res.render("index", { songsList: songs, setup: "Joke cannot be loaded at this time", delivery: "Please reload / try again later" });
}

});
});

app.listen(process.env.PORT || 3000, function(err){
    if(err){
        throw(err);
    }
    console.log("Server has started");
});