const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/playlist");

const songSchema = mongoose.Schema({
    name: String,
    user: String,
    platform: String,
    link: String
});

const Song = mongoose.model("song", songSchema);

const song_1 = new Song({
    name: "Lofu Girl",
    user: "Abhijith Dameruppala",
    platform: "youtube",
    link: "https://www.youtube.com/watch?v=jfKfPfyJRdk"
});

// song_1.save().then(() => console.log("Song added successfully!"));

// const output = Song.find({"_id" : 'ObjectId("64ac09230a3e90277bf49843")'});
// console.log(output);

// Song.findOneAndDelete({ name: "Lofu Girl" })
//   .then(deletedSong => {
//     if (deletedSong) {
//       console.log("Song deleted:", deletedSong);
//     } else {
//       console.log("Song not found.");
//     }
//   })
//   .catch(err => {
//     console.error(err);
//   });


// Song.find({})
//   .then(songs => {
//     console.log(songs);
//   })
//   .catch(err => {
//     console.error(err);
//   });