const express = require('express');
const router = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a list of all the notes.
router.route("/?").get(function (req, res) {
    const userID = req.query.userID;
    const playlistID = req.query.playlistID;
    const db_connect = dbo.getDb("music_notes");
    db_connect
        .collection("notes")
        .find({
            user: userID,
            playlist: playlistID,
        })
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you create a new note.
router.route('/add').post(function (req, response) {
    const db_connect = dbo.getDb();
    const myobj = {
        user: req.body.user,
        playlist: req.body.playlist,
        track: req.body.track,
        note: req.body.note,
    };
    db_connect.collection("notes").insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
});

module.exports = router;