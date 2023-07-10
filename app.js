const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const mongoose = require("mongoose");


function timeConverter(inp){
    var hours = 0;
    var min = 0;
    var sec = 0;
    let h = 1;
    let m = 1;
    let s = 1;
        for (var i = 2; i < inp.length; i ++){
        if(inp[i] == "H"){
            h = i;
        }
        if(inp[i] == "M"){
            m = i;
        }
        if(inp[i] == "S"){
            s = i;
        }
    }
    for (var i = 2; i < h; i ++){
        hours = hours * 10 + Number(inp[i])
    }
    for (var i = h + 1; i < m; i ++){
        min = min * 10 + Number(inp[i])
    }
    for (var i = m + 1; i < s; i ++){
        sec = sec * 10 + Number(inp[i])
    }
    sec = sec + (hours * 3600) + (min * 60);
    return sec;
}

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
        // Sending the stuff to the frontend
        res.render("index", {songsList: songs});
    })
        .catch(err => {
        console.error(err);
    });
    // var vidLink = "YBkfHAVKwNE";
    // var ytURL = "https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=" + vidLink + "&key=" + ytAPI;
    // https.get(ytURL, function(response){
    //     response.on("data", function(data){
    //         let datainp = JSON.parse(data);
    //         console.log(timeConverter(datainp.items[0].contentDetails.duration));
    //     });
    // });
});

app.listen(3000, function(err){
    if(err){
        throw(err);
    }
    console.log("Server has started on port: 3000");
});