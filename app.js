const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

var song = {"title": "Lofi Girl",
            "link": "https://www.youtube.com/watch?v=jfKfPfyJRdk"};

var songsList = [song];

app.post("/add", function(req, res){
    let song = {"title": req.body.title,
                "link": req.body.link};
    songsList.push(song);
    res.redirect("/");
});

app.post("/remove", function(req, res){
    for(var i = 0; i < songsList.length; i++){
        if(songsList[i].title == req.body.removeTitle){
            const index = i;
            songsList.splice(index, 1);
            console.log(songsList);
            break
        };
    }
    res.redirect("/");
    
})

app.get("/", function(req, res){
    res.render("index", {songsList: songsList});
});

app.listen(3000, function(err){
    if(err){
        throw(err);
    }
    console.log("Server has started on port: 3000");
});